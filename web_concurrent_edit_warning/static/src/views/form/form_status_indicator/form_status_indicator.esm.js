/** @odoo-module **/
// Copyright 2025 Akretion (http://www.akretion.com).
// @author Florian Mounier <florian.mounier@akretion.com>
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

import {
    Component,
    onWillUnmount,
    useEffect,
    useExternalListener,
    useRef,
    useState,
} from "@odoo/owl";
import {FormStatusIndicator} from "@web/views/form/form_status_indicator/form_status_indicator";
import {patch} from "@web/core/utils/patch";
import {useBroadcastChannel} from "../../../core/utils/hooks.esm";
import {usePopover} from "@web/core/popover/popover_hook";

class ConcurrentEditWarningPopover extends Component {}
ConcurrentEditWarningPopover.template =
    "web_concurrent_edit_warning.ConcurrentEditWarningPopover";

patch(
    FormStatusIndicator.prototype,
    "web_concurrent_edit_warning.FormStatusIndicator",
    {
        setup() {
            this.dirtyRemotes = useState([]);
            this.broadcastChannel = useBroadcastChannel(
                "odoo_concurrent_edit_warning_channel",
                (message) => this._handleChannelMessage(message)
            );
            this.popover = usePopover();
            this._currentConcurrentEditPopover = null;
            this._concurrentEditButtonRef = useRef("concurrent_edit_warning_button");

            // At start and on record change, request the current dirty state
            useEffect(
                () => {
                    // Unique identifier specific to model/id
                    this._uid = new Date().getTime();
                    const {resModel, resId} = this.props.model.root;
                    this._refreshConcurrentEditRemotes(resModel, resId);
                },
                () => [this.props.model.root.resId, this.props.model.root.resModel]
            );

            // Notify others when local dirty state changes
            useEffect(
                () => {
                    const {resModel, resId} = this.props.model.root;
                    this._notifyConcurrentEditChange(resModel, resId, this.dirty);
                },
                () => [
                    this.dirty,
                    this.props.model.root.resId,
                    this.props.model.root.resModel,
                ]
            );

            // Auto open popover when multi edit detected
            useEffect(
                () => {
                    if (this.showConcurrentEditWarning) {
                        this.openConcurrentEditWarningPopover();
                    } else if (!this.showConcurrentEditWarning) {
                        this.closeConcurrentEditWarningPopover();
                    }
                },
                () => [this.showConcurrentEditWarning, this.dirtyRemotes.length]
            );

            const unregisterBeforeUnload = () => {
                const {resModel, resId} = this.props.model.root;
                this._notifyConcurrentEditChange(resModel, resId, false);
            };

            onWillUnmount(unregisterBeforeUnload.bind(this));
            useExternalListener(
                window,
                "beforeunload",
                unregisterBeforeUnload.bind(this)
            );
        },

        _handleChannelMessage(message) {
            const {resModel, resId} = this.props.model.root;
            // Change remote dirty state according to remote message
            if (message.type === "change") {
                if (resModel === message.resModel && resId === message.resId) {
                    if (message.dirty && !this.dirtyRemotes.includes(message.uid)) {
                        this.dirtyRemotes.push(message.uid);
                    } else if (
                        !message.dirty &&
                        this.dirtyRemotes.includes(message.uid)
                    ) {
                        this.dirtyRemotes.splice(
                            this.dirtyRemotes.indexOf(message.uid),
                            1
                        );
                    }
                }
                // Sync request: reply with current dirty state
            } else if (message.type === "sync") {
                if (resModel === message.resModel && resId === message.resId) {
                    this._notifyConcurrentEditChange(resModel, resId, this.dirty);
                }
            }
        },

        _notifyConcurrentEditChange(resModel, resId, dirty) {
            this.broadcastChannel.postMessage({
                type: "change",
                resModel: resModel,
                resId: resId,
                dirty: dirty,
                uid: this._uid,
            });
        },
        _refreshConcurrentEditRemotes(resModel, resId) {
            this.dirtyRemotes.splice(0, this.dirtyRemotes.length);
            this.broadcastChannel.postMessage({
                type: "sync",
                resModel: resModel,
                resId: resId,
                uid: this._uid,
            });
        },

        openConcurrentEditWarningPopover() {
            if (this._currentConcurrentEditPopover) {
                this.closeConcurrentEditWarningPopover();
            }
            if (!this._concurrentEditButtonRef.el) {
                return;
            }
            this._currentConcurrentEditPopover = this.popover.add(
                this._concurrentEditButtonRef.el,
                ConcurrentEditWarningPopover,
                {
                    onClose: this.closeConcurrentEditWarningPopover.bind(this),
                    userCount: this.dirtyRemotes.length,
                    refreshConcurrentEditRemotes: () => {
                        const {resModel, resId} = this.props.model.root;
                        this._refreshConcurrentEditRemotes(resModel, resId);
                    },
                    discardChanges: () => {
                        this.discard();
                    },
                },
                {
                    position: "bottom",
                    onClose: () => {
                        this._currentConcurrentEditPopover = null;
                    },
                    closeOnClickAway: false,
                }
            );
        },

        closeConcurrentEditWarningPopover() {
            if (this._currentConcurrentEditPopover) {
                this._currentConcurrentEditPopover();
                this._currentConcurrentEditPopover = null;
            }
        },

        toggleConcurrentEditWarningPopover() {
            if (this._currentConcurrentEditPopover) {
                this.closeConcurrentEditWarningPopover();
            } else {
                this.openConcurrentEditWarningPopover();
            }
        },

        get dirty() {
            return this.props.model.root.isDirty || this.props.fieldIsDirty;
        },

        get remoteDirty() {
            return this.dirtyRemotes.length > 0;
        },

        get showConcurrentEditWarning() {
            return this.remoteDirty && this.dirty;
        },
    }
);

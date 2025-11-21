/** @odoo-module **/
// Copyright 2025 Akretion (http://www.akretion.com).
// @author Florian Mounier <florian.mounier@akretion.com>
// License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

import {useComponent, useEffect} from "@odoo/owl";
/**
 * Attach to a broadcast channel
 *
 * @param {String} channel
 * @param {Callback} callback
 * @param {Object} options
 * @param {Boolean} options.debug - Enable debug logging
 * @returns {Object} - An object with a postMessage function to send messages on the channel
 */
export function useBroadcastChannel(channel, callback, options = {}) {
    const component = useComponent();
    component._current_bc = null;
    useEffect(
        () => {
            if (!component._current_bc) {
                if (options.debug) {
                    console.log(`Initializing broadcast channel ${channel}`);
                }
                component._current_bc = new BroadcastChannel(channel);
            }
            component._current_bc.onmessage = (evt) => {
                if (options.debug) {
                    console.log(`Received message on channel ${channel}:`, evt.data);
                }
                callback.bind(component)(evt.data);
            };
            return () => {
                if (options.debug) {
                    console.log(`Closing broadcast channel ${channel}`);
                }
                component._current_bc.close();
                component._current_bc = null;
            };
        },
        () => [channel]
    );
    const postMessage = (message) => {
        if (component._current_bc) {
            if (options.debug) {
                console.log(`Posting message on channel ${channel}:`, message);
            }
            component._current_bc.postMessage(message);
        } else if (options.debug) {
            console.warn(
                `Cannot post message, broadcast channel ${channel} is not initialized`
            );
        }
    };
    return {postMessage};
}

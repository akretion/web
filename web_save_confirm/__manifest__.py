# Copyright 2025 Akretion - Renato Lima <renato.lima@akretion.com.br>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).
{
    "name": "Show confirmation dialogue before save records",
    "version": "16.0.1.0.0",
    "author": "Akretion, Odoo Community Association (OCA)",
    "website": "https://github.com/OCA/web",
    "license": "AGPL-3",
    "category": "Tools",
    "depends": [
        "web",
    ],
    "assets": {
        "web.assets_backend": [
            "web_save_confirm/static/src/js/web_save_confirm.esm.js",
        ],
        "web.qunit_suite_tests": [
            "web_save_confirm/static/tests/**/*",
        ],
    },
    "installable": True,
}

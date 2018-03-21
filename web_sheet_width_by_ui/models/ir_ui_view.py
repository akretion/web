# coding: utf-8
# © 2016 David BEAL @ Akretion
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from odoo import models, fields


class IrUiView(models.Model):
    _inherit = 'ir.ui.view'

    def _get_form_width(self):
        return [('oe_form_sheet_full_screen', 'Full Screen'), ]

    form_width = fields.Selection(
        string='Form Width', selection='_get_form_width',
        help="Allow to set the form view to the max width "
             "to have a better usability on data entry")

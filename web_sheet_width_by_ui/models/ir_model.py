# coding: utf-8
# © 2016 David BEAL @ Akretion
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from lxml import etree

from odoo import models, api
from odoo.osv import orm


class IrModel(models.Model):
    _inherit = 'ir.model'

    def _css_class_to_apply(self, node, css_class):
        """ Complete class if exist """
        existing_class = [
            x[1] for x in node.items()
            if x[0] == 'class']
        if existing_class:
            css_class = '%s %s' % (
                css_class, existing_class[0])
        return css_class

    # @api.multi
    def _adjust_form_width(self):

        # @api.multi
        # def _wrap_name_create():
        #     def wrapper(self):
        #         ""
        #     return wrapper

        @api.model
        def fields_view_get(self, view_id=None, view_type='form',
                            toolbar=False, submenu=False):
            import pdb; pdb.set_trace()
            # Perform standard fields_view_get
            res = fields_view_get.origin(
                self, view_id=view_id, view_type=view_type,
                toolbar=toolbar, submenu=submenu)
            # customize xml output
            if view_type == 'form' and res.get('view_id'):
                view = self.env['ir.ui.view'].browse(res.get('view_id'))
                if view.form_width:
                    model_m = self.env['ir.model']
                    doc = etree.XML(res['arch'])
                    node = doc.xpath('//sheet')
                    if node:
                        css_class = view.form_width
                        for current_node in node:
                            new_css = model_m._css_class_to_apply(
                                current_node, css_class)
                            current_node.set('class', new_css)
                            orm.setup_modifiers(current_node)
                    res['arch'] = etree.tostring(doc, pretty_print=True)
            return res
        import pdb; pdb.set_trace()
        return fields_view_get

        # for model in self:
        #     print "             JE sios la"
        #     import pdb; pdb.set_trace()
            # if model.avoid_quick_create:
            #     model_name = model.model
            #     model_obj = self.env.get(model_name)
            #     if (
            #             not isinstance(model_obj, type(None)) and
            #             not hasattr(model_obj, 'check_quick_create')):
            #         model_obj._patch_method('name_create', _wrap_name_create())
            #         model_obj.check_quick_create = True
        # return True

    @api.model_cr
    def _register_hook(self):
        import pdb; pdb.set_trace()
        models = self.search([])
        models._adjust_form_width()
        return super(IrModel, self)._register_hook()


    # def _register_hook(self, cr, ids=None):

    #     def make_fields_view_get():

    #         @api.model
    #         def fields_view_get(self, view_id=None, view_type='form',
    #                             toolbar=False, submenu=False):
    #             # Perform standard fields_view_get
    #             res = fields_view_get.origin(
    #                 self, view_id=view_id, view_type=view_type,
    #                 toolbar=toolbar, submenu=submenu)
    #             # customize xml output
    #             if view_type == 'form' and res.get('view_id'):
    #                 view = self.env['ir.ui.view'].browse(res.get('view_id'))
    #                 if view.form_width:
    #                     model_m = self.env['ir.model']
    #                     doc = etree.XML(res['arch'])
    #                     node = doc.xpath('//sheet')
    #                     if node:
    #                         css_class = view.form_width
    #                         for current_node in node:
    #                             new_css = model_m._css_class_to_apply(
    #                                 current_node, css_class)
    #                             current_node.set('class', new_css)
    #                             orm.setup_modifiers(current_node)
    #                     res['arch'] = etree.tostring(doc, pretty_print=True)
    #             return res

    #         return fields_view_get

    #     if ids is None:
    #         ids = self.search(cr, SUPERUSER_ID, [])
    #     for model in self.browse(cr, SUPERUSER_ID, ids):
    #         Model = self.pool.get(model.model)
    #         if Model:
    #             Model._patch_method('fields_view_get', make_fields_view_get())
    #     return super(ModelExtended, self)._register_hook(cr)

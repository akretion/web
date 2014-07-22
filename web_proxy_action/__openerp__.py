# -*- coding: utf-8 -*-
###############################################################################
#
#   Module for OpenERP
#   Copyright (C) 2014 Akretion (http://www.akretion.com).
#   @author Sébastien BEAU <sebastien.beau@akretion.com>
#
#   This program is free software: you can redistribute it and/or modify
#   it under the terms of the GNU Affero General Public License as
#   published by the Free Software Foundation, either version 3 of the
#   License, or (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU Affero General Public License for more details.
#
#   You should have received a copy of the GNU Affero General Public License
#   along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
###############################################################################

{'name': 'WebClient Proxy Action',
 'version': '0.0.1',
 'author': 'Akretion',
 'website': 'www.akretion.com',
 'license': 'AGPL-3',
 'category': 'Web',
 'description': """
 This module give the posility to use a new type of action
 "ir.action.act_proxy". This action will be interpreted as
 an ajax call to do on webclient side.

 for exemple if a method return this
return {
    'type': 'ir.actions.act_proxy',
    'action_list': [{
        'url' : 'http://localhost:8169/cups/printData',
        'params': {
            'args': ['zebra', label.datas],
            'kwargs': {'options': {'raw': True}},
            }
    }],
    }
The client will do an ajax call with the params
The main aim is to give the posibility to print report
from the ERP backoffice directly on a raspberry pi with
a pywebdriver or a posbox installed
 """,
 'depends': [
     'base',
     'web',
 ],
 'data': [
 ],
 'js': [
    'static/src/js/view.js',
 ],
 'installable': True,
 'application': True,
}

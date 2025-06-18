# -*- coding: utf-8 -*-
{
    'name': "LERM Dashboard",

    'summary': """Lerm Dashboard""",

    'description': """
        Long description of module's purpose
    """,

    'author': "Esehat",
    'website': "http://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/13.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',
    'depends': ['base','lerm_civil'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
    "views/dashboard.xml",
    ],
    'assets': {
        'web.assets_backend': [
            'lerm_civil_dashboard/static/src/components/main_dashboard.js',
            'lerm_civil_dashboard/static/src/components/main_dashboard.xml',
            'lerm_civil_dashboard/static/src/components/chart_renderer/chart_renderer.js',
            'lerm_civil_dashboard/static/src/components/chart_renderer/chart_renderer.xml',
            'lerm_civil_dashboard/static/src/components/kpi_box/kpi_box.js',
            'lerm_civil_dashboard/static/src/components/kpi_box/kpi_box.xml',
            'lerm_civil_dashboard/static/src/css/dashboard_styles.css',
        ],
        'web.assets_qweb': [
            'lerm_civil_dashboard/static/src/**/*.xml',
            'lerm_civil_dashboard/static/src/components/**/*.xml'
            
        ],
    },
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    'installable': True,
    'auto_install': False,
    'application': False,
    "images": ["/static/description/banner.png"],
    "license": "OPL-1"
}

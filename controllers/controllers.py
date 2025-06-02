# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
import json
from datetime import datetime


class LermDashboard(http.Controller):
        
    @http.route(['/dashboard/get_data_by_date'], type="json", auth="user")
    def get_data_by_date(self, **kw):
        start_date = kw.get('start_date')
        end_date = kw.get('end_date')
        
        # Convert string dates to datetime objects
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        
        # Example query - adjust based on your models
        domain = [
            ('date', '>=', start_date),
            ('date', '<=', end_date)
        ]
        
        # Get your data from the models
        records = request.env['your.model'].sudo().search(domain)
        
        # Process data as needed for your dashboard
        # This is just an example structure
        result = {
            'total_count': len(records),
            'start_date': start_date,
            'end_date': end_date,
            # Add other aggregated data here
        }
        
        return json.dumps(result)
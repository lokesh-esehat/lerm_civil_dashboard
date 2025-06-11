from odoo import http
from odoo.http import request
from datetime import datetime
from collections import defaultdict
import json

class LermCivilDashboard(http.Controller):

    @http.route(['/dashboard/getdata'], type="json", auth="user", methods=["POST"])
    def get_dashboard_data(self, **kw):
        start_date = kw.get('start_date')
        end_date = kw.get('end_date')

        # Parse and validate dates
        try:
            start_dt = datetime.strptime(start_date, '%Y-%m-%d')
            end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        except Exception as e:
            return json.dumps({"error": "Invalid date format"})

        # Search domain
        domain = [
            ('sample_received_date', '>=', start_dt),
            ('sample_received_date', '<=', end_dt),
        ]

        # Fetch matching records
        samples = request.env['lerm.srf.sample'].sudo().search(domain)

        # Count per state
        state_counter = defaultdict(int)
        for sample in samples:
            state_counter[sample.state] += 1

        state_data = [{"state": state, "count": count} for state, count in state_counter.items()]

        return json.dumps({
            "state_data": state_data,
            "total_count": len(samples),
        })

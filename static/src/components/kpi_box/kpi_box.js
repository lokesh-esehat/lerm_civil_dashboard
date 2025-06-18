/** @odoo-module */

import { registry } from "@web/core/registry";
import { useEffect, useService } from "@web/core/utils/hooks";

// import { loadJS } from "@web/core/assets"
import { loadJS } from "web.ajax";

const { Component } = owl;
const { useRef, onWillStart, onMounted, onWillUnmount } = owl.hooks;
export class KpiBox extends Component {
  setup() {
    this.subjectRef = useRef("subject");
    this.valueRef = useRef("value");
    this.actionService = useService("action"); // Changed from this.action to this.actionService

    useEffect(
      () => {
        this.renderKPI();
      },
      () => [this.props]
    );

    onMounted(() => this.renderKPI());
  }

  renderKPI() {
    this.subjectRef.el.innerHTML = this.props.title;
    this.valueRef.el.innerHTML = this.props.value;
  }

  // viewAlloted() {
  //   this.actionService.doAction(
  //     "lerm_civil.test_sample_pending_allotted_action"
  //   );
  // }
}

KpiBox.template = "lerm_civil_dashboard.KpiBox";

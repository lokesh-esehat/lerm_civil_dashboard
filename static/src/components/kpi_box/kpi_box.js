/** @odoo-module */

import { registry } from "@web/core/registry";
import { useEffect } from "@web/core/utils/hooks";

// import { loadJS } from "@web/core/assets"
import { loadJS } from "web.ajax";

const { Component } = owl;
const { useRef, onWillStart, onMounted, onWillUnmount } = owl.hooks;
export class KpiBox extends Component {
  setup() {
    this.subjectRef = useRef("subject");
    this.valueRef = useRef("value");

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
}

KpiBox.template = "lerm_civil_dashboard.KpiBox";
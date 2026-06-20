import type { Playbook } from "@/domain/types";

/**
 * The knowledge base: encoded cause-and-effect for common world events.
 *
 * Each playbook is intentionally narrow and readable. The engine fires a
 * playbook when ANY trigger matches, then surfaces its consequences split by
 * lens (business vs personal). Confidence reflects how reliably the effect
 * has followed historically — these are heuristics to orient a decision, not
 * forecasts. Add new playbooks here; no engine changes are needed.
 */
export const PLAYBOOKS: Playbook[] = [
  {
    id: "oil_spike",
    title: "Oil prices spike",
    when: "Crude oil rises sharply in a short window",
    triggers: [{ signalId: "oil_brent", condition: "spikes", threshold: 8 }],
    tags: ["energy", "inflation", "logistics"],
    consequences: [
      {
        lens: "business",
        statement: "Shipping, freight, and delivery costs rise within weeks.",
        mechanism: "Fuel is a direct input to transport and many supply chains.",
        horizon: "weeks",
        confidence: 0.8,
        severity: "high",
        actions: [
          "Review margins on shipping-heavy products and consider surcharges.",
          "Lock in freight contracts before carriers re-price.",
          "Prioritize local or nearshore suppliers for vulnerable SKUs.",
        ],
      },
      {
        lens: "business",
        statement: "Consumer discretionary demand tends to soften.",
        mechanism: "Higher pump and energy bills leave households less to spend.",
        horizon: "months",
        confidence: 0.6,
        severity: "medium",
        actions: [
          "Shift messaging toward value and essential use-cases.",
          "Delay price increases on non-essential lines.",
        ],
      },
      {
        lens: "personal",
        statement: "Fuel and heating/cooling bills climb; headline inflation ticks up.",
        mechanism: "Energy feeds directly into transport and utility costs.",
        horizon: "weeks",
        confidence: 0.85,
        severity: "medium",
        actions: [
          "Budget a buffer for transport and utilities over the next 1-2 months.",
          "Energy-sector and commodity holdings often benefit as a partial hedge.",
        ],
      },
    ],
  },
  {
    id: "oil_drop",
    title: "Oil prices fall sharply",
    when: "Crude oil drops sharply in a short window",
    triggers: [{ signalId: "oil_brent", condition: "drops", threshold: 8 }],
    tags: ["energy", "disinflation"],
    consequences: [
      {
        lens: "business",
        statement: "Input and logistics costs ease, supporting margins.",
        mechanism: "Cheaper fuel lowers transport and many production costs.",
        horizon: "weeks",
        confidence: 0.7,
        severity: "medium",
        actions: ["Hold pricing to expand margin, or pass savings on to win share."],
      },
      {
        lens: "personal",
        statement: "Cheaper fuel acts like a small tax cut on household budgets.",
        mechanism: "Lower energy prices free up discretionary income.",
        horizon: "weeks",
        confidence: 0.75,
        severity: "low",
        actions: ["Redirect fuel savings toward debt paydown or savings."],
      },
    ],
  },
  {
    id: "rate_cut",
    title: "Interest rates cut",
    when: "The policy interest rate falls",
    triggers: [{ signalId: "fed_funds_rate", condition: "falls", threshold: 2 }],
    tags: ["rates", "credit", "growth"],
    consequences: [
      {
        lens: "business",
        statement: "Borrowing gets cheaper; financing growth becomes easier.",
        mechanism: "Lower policy rates pull down loan and credit-line costs.",
        horizon: "months",
        confidence: 0.75,
        severity: "medium",
        actions: [
          "Revisit capex and hiring plans that were rate-sensitive.",
          "Refinance variable-rate debt while terms improve.",
        ],
      },
      {
        lens: "personal",
        statement: "Mortgage and loan rates tend to ease; savings yields drop.",
        mechanism: "Retail lending and deposit rates track the policy rate.",
        horizon: "months",
        confidence: 0.7,
        severity: "medium",
        actions: [
          "Check whether refinancing a mortgage or loan now makes sense.",
          "Lock longer-term savings rates before they fall further.",
        ],
      },
      {
        lens: "personal",
        statement: "Rate-sensitive assets (equities, bonds, real estate) often get a lift.",
        mechanism: "Lower discount rates raise the present value of future cash flows.",
        horizon: "quarters",
        confidence: 0.55,
        severity: "low",
        actions: ["Review portfolio duration and allocation for the new rate path."],
      },
    ],
  },
  {
    id: "rate_hike",
    title: "Interest rates raised",
    when: "The policy interest rate rises",
    triggers: [{ signalId: "fed_funds_rate", condition: "rises", threshold: 2 }],
    tags: ["rates", "credit", "tightening"],
    consequences: [
      {
        lens: "business",
        statement: "Credit tightens and the cost of capital rises.",
        mechanism: "Higher policy rates raise loan and refinancing costs.",
        horizon: "months",
        confidence: 0.75,
        severity: "high",
        actions: [
          "Extend runway; prioritize profitability over growth-at-all-costs.",
          "Refinance or fix debt before rates climb further.",
        ],
      },
      {
        lens: "personal",
        statement: "Variable loans cost more; savings yields improve.",
        mechanism: "Lending and deposit rates rise with policy.",
        horizon: "months",
        confidence: 0.7,
        severity: "medium",
        actions: [
          "Prioritize paying down variable-rate debt.",
          "Move idle cash into higher-yield savings or short-term instruments.",
        ],
      },
    ],
  },
  {
    id: "gold_surge",
    title: "Gold surges",
    when: "Gold rises sharply",
    triggers: [{ signalId: "gold", condition: "spikes", threshold: 4 }],
    tags: ["safe-haven", "risk-off", "uncertainty"],
    consequences: [
      {
        lens: "business",
        statement: "A risk-off mood is building; expect more cautious customers and investors.",
        mechanism: "Gold rallies when markets price rising uncertainty or fear.",
        horizon: "weeks",
        confidence: 0.55,
        severity: "medium",
        actions: [
          "Shore up cash reserves; pull forward any planned fundraising.",
          "Stress-test the plan against a demand slowdown.",
        ],
      },
      {
        lens: "personal",
        statement: "Markets are signaling caution; safe-haven demand is rising.",
        mechanism: "Investors rotate to gold during uncertainty.",
        horizon: "weeks",
        confidence: 0.55,
        severity: "low",
        actions: ["Revisit your emergency fund and overall risk exposure."],
      },
    ],
  },
  {
    id: "inflation_cooling",
    title: "Inflation cooling",
    when: "Inflation falls toward target",
    triggers: [{ signalId: "cpi_inflation", condition: "falls", threshold: 5 }],
    tags: ["macro", "disinflation", "purchasing-power"],
    consequences: [
      {
        lens: "business",
        statement: "Input-cost pressure eases and rate cuts become more likely.",
        mechanism: "Cooling prices give central banks room to ease policy.",
        horizon: "quarters",
        confidence: 0.6,
        severity: "low",
        actions: ["Plan for a lower-rate environment in next year's budget."],
      },
      {
        lens: "personal",
        statement: "Purchasing power stabilizes; real wages have room to recover.",
        mechanism: "Slower price growth means each dollar holds value longer.",
        horizon: "quarters",
        confidence: 0.6,
        severity: "low",
        actions: ["A good window to rebuild savings as price pressure eases."],
      },
    ],
  },
  {
    id: "equity_selloff",
    title: "Equity market sells off",
    when: "The broad equity index drops materially",
    triggers: [{ signalId: "equity_index", condition: "drops", threshold: 3 }],
    tags: ["markets", "risk-off", "sentiment"],
    consequences: [
      {
        lens: "business",
        statement: "Fundraising and exit windows narrow; valuations compress.",
        mechanism: "Falling public multiples flow through to private rounds.",
        horizon: "months",
        confidence: 0.6,
        severity: "medium",
        actions: [
          "Extend runway and tighten burn before raising.",
          "Reset valuation expectations for any near-term round.",
        ],
      },
      {
        lens: "personal",
        statement: "Portfolio values dip; for long horizons this is noise, not signal.",
        mechanism: "Equity drawdowns are frequent and usually temporary.",
        horizon: "weeks",
        confidence: 0.65,
        severity: "low",
        actions: [
          "Avoid panic-selling; keep contributing on schedule.",
          "Rebalance if allocations have drifted meaningfully.",
        ],
      },
    ],
  },
  {
    id: "tariffs_advancing",
    title: "Import tariffs advancing",
    when: "Tariff legislation gains momentum",
    triggers: [{ signalId: "tariff_bill", condition: "above", threshold: 60 }],
    tags: ["legislation", "trade", "supply-chain"],
    consequences: [
      {
        lens: "business",
        statement: "Imported-input costs are likely to rise; supply chains need a rethink.",
        mechanism: "Tariffs add a direct cost to affected imported goods.",
        horizon: "months",
        confidence: 0.7,
        severity: "high",
        actions: [
          "Map exposure to affected import categories now.",
          "Qualify domestic or allied-country suppliers as alternates.",
          "Model price scenarios so you can move quickly if it passes.",
        ],
      },
      {
        lens: "personal",
        statement: "Prices on affected imported goods may rise once enacted.",
        mechanism: "Importers commonly pass tariff costs to consumers.",
        horizon: "quarters",
        confidence: 0.55,
        severity: "low",
        actions: ["Consider larger purchases of affected durable goods before enactment."],
      },
    ],
  },
  {
    id: "heatwave",
    title: "Severe heatwave",
    when: "A prolonged heat event hits key regions",
    triggers: [{ signalId: "heat_event", condition: "above", threshold: 70 }],
    tags: ["weather", "agriculture", "energy"],
    consequences: [
      {
        lens: "business",
        statement: "Expect agricultural supply hits, energy-demand spikes, and logistics delays.",
        mechanism: "Extreme heat stresses crops, grids, and outdoor operations.",
        horizon: "weeks",
        confidence: 0.6,
        severity: "medium",
        actions: [
          "Build slack into delivery promises for affected regions.",
          "Hedge or pre-buy heat-exposed agricultural inputs.",
        ],
      },
      {
        lens: "personal",
        statement: "Cooling/energy bills rise; some fresh-food prices may tick up.",
        mechanism: "Heat drives electricity demand and pressures crop yields.",
        horizon: "weeks",
        confidence: 0.55,
        severity: "low",
        actions: ["Budget for a higher summer energy bill."],
      },
    ],
  },
];

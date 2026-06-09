export const stepSuggestions = [
  // =========================================================
  // NAVIGATION
  // =========================================================

  {
    label: 'I navigate to "PageName" page',
    insertText: 'I navigate to "${1:$page}" page',
    category: "navigation",
  },
  {
    label: 'I access in the "PageName" page',
    insertText: 'I access in the "${1:}" page',
    category: "navigation",
  },

  {
    label: 'I access to external "PageName" page',
    insertText: 'I access to external "${1:}" page',
    category: "navigation",
  },

  {
    label: 'I switch to "Name" "Type" between "PageName" page',
    insertText:
      'I switch to "${1:Name}" "${2:Type}" between "${3:PageName}" page',
    category: "navigation",
  },

  // =========================================================
  // CLICKS / ACTIONS
  // =========================================================

  {
    label: 'I click on the "PageName"."ElementName"',
    insertText: 'I click on the "${1:}"."${2:}"',
    category: "ui",
  },

  {
    label: 'I double click on the "PageName"."ElementName"',
    insertText: 'I double click on the "${1:}"."${2:}"',
    category: "ui",
  },

  {
    label: 'I right click on the "PageName"."ElementName"',
    insertText: 'I right click on the "${1:}"."${2:}"',
    category: "ui",
  },

  {
    label: 'I click in the all "PageName"."ElementName" list',
    insertText: 'I click in the all "${1:}"."${2:}" list',
    category: "ui",
  },

  {
    label: 'I scroll to see "PageName"."ElementName" field',
    insertText: 'I scroll to see "${1:}"."${2:}" field',
    category: "ui",
  },

  {
    label: 'I hover the "PageName"."ElementName"',
    insertText: 'I hover the "${1:}"."${2:}"',
    category: "ui",
  },

  // =========================================================
  // INPUTS / DATA
  // =========================================================

  {
    label: 'I write "Text" in the "PageName"."ElementName" field',
    insertText:
      'I write "${1:Text}" in the "${2:PageName}" "${3:ElementName}" field',
    category: "data",
  },

  {
    label:
      'I write my "DataType"."DataKey" in the "PageName"."ElementName" field',
    insertText:
      'I write my "${1:DataType}"."${2:DataKey}" in the "${3:PageName}" "${4:ElementName}" field',
    category: "data",
  },

  {
    label:
      'I write a random value between "Min" and "Max" in the "PageName"."ElementName" field',
    insertText:
      'I write a random value between "${1:10}" and "${2:100}" in the "${3:PageName}"."${4:ElementName}" field',
    category: "data",
  },

  {
    label: 'I write all fields in "PageName" page',
    insertText: 'I write all fields in "${1:}" page',
    category: "data",
  },

  // =========================================================
  // SELECT / LISTS
  // =========================================================

  {
    label: 'I select "Value" in the "PageName"."ElementName" list',
    insertText:
      'I select "${1:Value}" in the "${2:PageName}" "${3:ElementName}" list',
    category: "ui",
  },

  {
    label: 'I select all values in the "PageName"."ElementName" list',
    insertText: 'I select all values in the "${1:}"."${2:}" list',
    category: "ui",
  },

  // =========================================================
  // ASSERTIONS
  // =========================================================

  {
    label: 'I see "Text" "text" in the "PageName"."ElementName" field',
    insertText:
      'I see "${1:Text}" "${2|text,label,data|}" in the "${3:PageName}" "${4:ElementName}" field',
    category: "assertion",
  },

  {
    label: 'I "see|dont_see" the "PageName"."ElementName" element',
    insertText:
      'I "${1|see,dont_see|}" the "${2:PageName}"."${3:ElementName}" element',
    category: "assertion",
  },

  {
    label: 'The button "PageName"."ElementName" is "enabled"',
    insertText:
      'The button "${1:}"."${2:}" is "${3|selected,disabled,not_selected,enabled|}"',
    category: "assertion",
  },

  {
    label: 'I verify the sum list with the total "PageName"."ElementName"',
    insertText: 'I verify the sum list with the total "${1:}"."${2:}"',
    category: "assertion",
  },

  {
    label:
      'I verify the sum of the payments over the last "Years" years "PageName"."ElementName"',
    insertText:
      'I verify the sum of the payments over the last "${1:3}" years "${2:PageName}"."${3:ElementName}"',
    category: "assertion",
  },

  {
    label: 'I "save|verify" the "PageName"."ElementName" value',
    insertText:
      'I "${1|save,verify|}" the "${2:PageName}"."${3:ElementName}" value',
    category: "assertion",
  },

  // =========================================================
  // AUTH / USERS
  // =========================================================

  {
    label: 'I am a "users"."UserType"',
    insertText: 'I am a "${1:users}"."${2:admin}"',
    category: "auth",
  },

  {
    label: 'I log in as "users"."UserType"',
    insertText: 'I log in as "${1:users}"."${2:standardUser}"',
    category: "auth",
  },

  {
    label: 'I reset my "users"."UserType"',
    insertText: 'I reset my "${1:users}"."${2:user}"',
    category: "auth",
  },

  // =========================================================
  // API / SERVICES
  // =========================================================

  {
    label: 'I get my "api"."RequestName"',
    insertText: 'I get my "${1:api}"."${2:RequestName}"',
    category: "api",
  },

  {
    label: 'I have a good "api"."ResponseName" response',
    insertText: 'I have a good "${1:api}"."${2:ResponseName}" response',
    category: "api",
  },

  // =========================================================
  // PAYMENTS
  // =========================================================

  {
    label: 'I make payment by credit card with "paybox" service',
    insertText:
      'I make payment by credit card with "${1|paybox,mercanet|}" service',
    category: "payment",
  },
];

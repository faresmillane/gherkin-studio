export const workspace = [
  {
    id: "ecommerce",
    name: "Ecommerce",
    pages: [{ name: "LoginPage" }, { name: "CartPage" }],
    steps: [
      {
        name: "navigation",
        patterns: [
          'Given I navigate to "(.*p)" page',
          'Given I access in the "(.*p)" page',
        ],
      },
      {
        name: "clicks",
        patterns: ['Given I click on the "(.*p)"."(.*e)" button'],
      },
      {
        name: "data",
        patterns: ['Given I write "(.*text)" in the "(.*p)"."(.*e)" field'],
      },
    ],
  },
];

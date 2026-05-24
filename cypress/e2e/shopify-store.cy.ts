describe("RealBeans Shopify storefront", () => {
  const baseUrl = "https://r1037354-realbeans.myshopify.com"

  const unlockStoreIfNeeded = () => {
    cy.get("body").then(($body) => {
      const passwordInput = $body.find(
        'input[name="password"], input[name="storefront_password"]'
      )

      if (passwordInput.length) {
        cy.get('input[name="password"], input[name="storefront_password"]')
          .first()
          .clear()
          .type("neatwi", { log: false })

        cy.contains('button, input[type="submit"]', /enter|submit|view store/i)
          .first()
          .click()
      }
    })
  }

  const visitStorePage = (path = "") => {
    cy.visit(`${baseUrl}${path}`, { failOnStatusCode: false })
    unlockStoreIfNeeded()
  }

  const getVisibleCoffeeNames = ($links: JQuery<HTMLAnchorElement>) => {
    return [...$links]
      .map((link) => link.textContent?.trim() || "")
      .filter(
        (text) => text === "Blended coffee" || text === "Roasted coffee beans"
      )
      .filter((text, index, arr) => arr.indexOf(text) === index)
  }

  beforeEach(() => {
    visitStorePage()
  })

  it("shows homepage intro text and product list", () => {
    cy.get("#MainContent").should(
      "contain",
      "Since 1801, RealBeans has roasted premium coffee in Antwerp for Europe’s finest cafes. Ethically sourced beans, crafted with care."
    )
    cy.get("#MainContent").should("contain", "Browse our latest products")
    cy.get("#MainContent").should("contain", "Blended coffee")
    cy.get("#MainContent").should("contain", "Roasted coffee beans")
  })

  it("catalog page shows the correct products", () => {
    visitStorePage("/collections/all")

    cy.get("#MainContent").should("contain", "Blended coffee")
    cy.get("#MainContent").should("contain", "Roasted coffee beans")
  })

  it("sorting products by price changes their order", () => {
    visitStorePage("/collections/all")

    cy.get('#MainContent a[href*="/products/"]:visible').then(($links) => {
      const before = getVisibleCoffeeNames($links)

      expect(before).to.deep.equal(["Blended coffee", "Roasted coffee beans"])
    })

    cy.get("select").first().select("Price, low to high", { force: true })

    cy.get('#MainContent a[href*="/products/"]:visible').should(($links) => {
      const after = getVisibleCoffeeNames($links)

      expect(after).to.deep.equal(["Roasted coffee beans", "Blended coffee"])
    })
  })

  it("blended coffee product page shows correct description and price", () => {
    visitStorePage("/products/blended-coffee")

    cy.get("#MainContent").should("contain", "Blended coffee")
    cy.get("#MainContent").should("contain", "RealBeans coffee, ready to brew.")
    cy.get("#MainContent").should("contain", "$55.00 USD")
    cy.get("#MainContent img").should("exist")
  })

  it("roasted coffee product page shows correct description and price", () => {
    visitStorePage("/products/roasted-coffee-beans")

    cy.url().should("include", "/products/roasted-coffee-beans")
    cy.get("#MainContent").should("contain", "Roasted coffee beans")
    cy.get("#MainContent").should(
      "contain",
      "Our best and sustainable real roasted beans."
    )
    cy.get("#MainContent").should("contain", "$40.00 USD")
    cy.get("#MainContent img").should("exist")
  })

  it("about page includes the history paragraph", () => {
    visitStorePage("/pages/about-page")

    cy.get("#MainContent").should(
      "contain",
      "From a small Antwerp grocery to a European coffee staple, RealBeans honors tradition while innovating for the future. Our beans are roasted in-house, shipped from Antwerp or Stockholm, and loved across the continent."
    )
  })
})

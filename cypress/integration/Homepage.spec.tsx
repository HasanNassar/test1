import * as React from 'react'
import {mount} from '@cypress/react'
import { format, addDays } from 'date-fns'

describe('The Home Page', () => {
  // remove .only for all tests
    it('successfully selects dates and times, and the URL contains it properly', () => {
        const today = new Date()
        const fromDate = addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30, 0), 2)
        const toDate = addDays(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30, 0), 5)

      cy.visit('/')
      cy.wait(500);

      // Date selection
      cy.get('[data-cy=fromDate]').click()
      cy.wait(500);      
      cy.get(`[data-cy=${format(fromDate, "MMMMdd")}]`).click()
      cy.wait(500);
      cy.get(`[data-cy=${format(toDate, "MMMMdd")}]`).click()
      cy.wait(500);
      cy.get('[data-cy=select]').click()      
      cy.wait(500);

      // Time selection
      cy.get('[data-cy=fromTime]').click()
      cy.wait(500);
      cy.get('[data-cy=1130]').click()
      cy.wait(500);            
      cy.get('[data-cy=toTime]').click()
      cy.wait(500);
      cy.get('[data-cy=1430]').click()
      
      // Navigate foward
      cy.wait(500);
      cy.get('[data-cy=seecars]').click()
     
      // Validate URL
      cy.url().should('include', `/?from=${encodeURIComponent(fromDate.toISOString())}&to=${encodeURIComponent(toDate.toISOString())}`) 
      
    })

    it('should navigate to the Terms of use page', () => {
      // Start from the index page
      cy.visit('/')
  
      // Find a link with an href attribute containing "terms_and_conditions" and click it
      cy.get('a[href*="terms_and_conditions"]').invoke('removeAttr', 'target').click()
      cy.wait(500);
  
      // The new url should include "/terms_and_conditions"
      cy.url().should('include', '/terms_and_conditions')
  
      // The new page should contain a header with "Terms and Conditions"
      cy.get('h2').contains('Terms and Conditions')
    })

    it('should navigate to the Privacy Policy page', () => {
      // Start from the index page
      cy.visit('/')
  
      // Find a link with an href attribute containing "privacy_policy" and click it
      cy.get('a[href*="privacy_policy"]').invoke('removeAttr', 'target').click()
  
      // The new url should include "/privacy_policy"
      cy.url().should('include', '/privacy_policy')
  
      // The new page should contain a text with "privacy@joinswapp.com"
      cy.get('p span').contains('privacy@joinswapp.com')
    })

    it.only('should navigate to the Profile page and check username', () => {
      // Start from the index page
      cy.visit('/')
  
      // Find a link with an href attribute containing "hamburger-menu-open" and click it
      cy.get('[data-cy=hamburger-menu-open]').click()
      cy.wait(500);
      
      cy.get('[data-cy=hamburger-opened]').should('be.visible')
      
      // Find a link with an href attribute containing "profile" and click it
      cy.get('a[href*="profile"]').click()
      
      // The new url should include "/profile"
      cy.url().should('include', '/profile')
      
      // The new page should contain a heading with min-length of 3 and store in variable
      let userName
      cy.get('h1', {
        timeout: 15000
      }).invoke('text').then((text) => {
        expect(text.length).to.be.at.least(3)
        userName = text
      })  
      
      // Find a link with an href attribute containing "profile-details-link" and click it
      cy.get('a[data-cy="profile-details-link"]').click()
      cy.wait(500);
      
      // The new url should include "/profile/details"
      cy.url().should('include', '/profile/details')

      // The new page should contain a heading with the same text as the one on the Profile page
      cy.get('h1', {
        timeout: 15000
      }).invoke('text').then((text) => {
        expect(text).to.eq(userName)
      })        
    })

  })

  
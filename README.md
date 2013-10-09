get-zoopla-property-value
=========================

Simple JavaScript script to scrape the value of a property from Zoopla.co.uk

What I do to run this on Windows is:
 * Install node.js
 * Run `node install` in the project directory to install dependencies
 * Find the Zoopla property id from a property's 'current values' page
  * Taking a random example, the id would be '22266536' on the page http://www.zoopla.co.uk/property/ashcroft/hamble-lane/bursledon/southampton/so31-8el/22266536
 * Run `node get-zoopla-property-value.js 123456`, where 123456 is the id you just found.

This will print out (to standard out) the current estimated value in pounds, without formatting (e.g. 123456 would be printed instead of £123,456).

Very few errors are currently reported, but any that are will be reported to standard error.

Steps may vary on other platforms; I believe `node repl` is the way to do command line scripts on non-Windows machines.

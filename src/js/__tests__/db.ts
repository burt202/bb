import {expect} from "chai"
import {convertNameToId} from "../db"

context("db", () => {
  context("convertNameToId", () => {
    it("should format strings correctly", () => {
      expect(convertNameToId("2015")).to.eql("2015")
      expect(convertNameToId("Razorback")).to.eql("razorback")
      expect(convertNameToId("Zack Bieber")).to.eql("zack-bieber")
      expect(convertNameToId("Plan X")).to.eql("plan-x")
      expect(convertNameToId("Lock-Jaw")).to.eql("lock-jaw")
    })
  })
})

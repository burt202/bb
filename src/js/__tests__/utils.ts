import {expect} from "chai"
import {convertNameToId, getPercentage} from "../utils"

context("utils", () => {
  context("convertNameToId", () => {
    it("should format strings correctly", () => {
      expect(convertNameToId("2015")).to.eql("2015")
      expect(convertNameToId("Razorback")).to.eql("razorback")
      expect(convertNameToId("Zack Bieber")).to.eql("zack-bieber")
      expect(convertNameToId("Plan X")).to.eql("plan-x")
      expect(convertNameToId("Lock-Jaw")).to.eql("lock-jaw")
      expect(convertNameToId("Earl Pancoast III")).to.eql("earl-pancoast-iii")
    })
  })

  context("getPercentage", () => {
    it("should return correctly", () => {
      expect(getPercentage(4, 3)).to.eql("75%")
      expect(getPercentage(0, 0)).to.eql("0%")
    })
  })
})

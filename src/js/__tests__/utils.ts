import {expect} from "chai"

import {convertNameToId, getBotStages, getPercentage} from "../utils"

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

  context("getBotStages", () => {
    context("data in correct order", () => {
      it("should return correctly", () => {
        const fights = [
          {
            bots: ["Tombstone", "Bronco"],
            winner: "Tombstone",
            stage: "semi",
            ko: true,
          },
          {
            bots: ["Ghost Raptor", "Biteforce"],
            winner: "Biteforce",
            stage: "semi",
            ko: true,
          },
          {
            bots: ["Tombstone", "Biteforce"],
            winner: "Biteforce",
            stage: "final",
            ko: false,
          },
        ]

        const res = getBotStages(fights)

        expect(res).to.eql({
          Biteforce: "winner",
          Bronco: "semi",
          "Ghost Raptor": "semi",
          Tombstone: "final",
        })
      })
    })

    context("data in incorrect order", () => {
      it("should return correctly", () => {
        const fights = [
          {
            bots: ["Tombstone", "Biteforce"],
            winner: "Biteforce",
            stage: "final",
            ko: false,
          },
          {
            bots: ["Tombstone", "Bronco"],
            winner: "Tombstone",
            stage: "semi",
            ko: true,
          },
          {
            bots: ["Ghost Raptor", "Biteforce"],
            winner: "Biteforce",
            stage: "semi",
            ko: true,
          },
        ]

        const res = getBotStages(fights)

        expect(res).to.eql({
          Biteforce: "winner",
          Bronco: "semi",
          "Ghost Raptor": "semi",
          Tombstone: "final",
        })
      })
    })
  })
})

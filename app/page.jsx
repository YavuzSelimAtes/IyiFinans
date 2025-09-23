"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function IyiFinansCampaign() {
  const [displayedSlogan, setDisplayedSlogan] = useState("")
  const [sloganComplete, setSloganComplete] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [showCalculation, setShowCalculation] = useState(false)

  const slogan = "İyi Gelecek"

  const monthOptions = [
    { value: "2", label: "Şubat" },
    { value: "3", label: "Mart" },
    { value: "4", label: "Nisan" },
    { value: "5", label: "Mayıs" },
    { value: "6", label: "Haziran" },
    { value: "7", label: "Temmuz" },
    { value: "8", label: "Ağustos" },
    { value: "9", label: "Eylül" },
  ]

  const formatNumber = (value) => {
    if (!value) return ""
    const numericValue = value.toString().replace(/\D/g, "")
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const parseNumber = (formattedValue) => {
    if (!formattedValue) return ""
    return formattedValue.replace(/\./g, "")
  }

  // Slogan renkli parçalar için ayrıştırma (ilk kelime mavi, ikinci kelime turkuaz)
  const [firstWordRaw, secondWordRaw] = slogan.split(" ")
  const firstWord = firstWordRaw || ""
  const secondWord = secondWordRaw || ""
  const typedFirstLen = Math.min(displayedSlogan.length, firstWord.length)
  const typedSecondLen = Math.max(0, displayedSlogan.length - firstWord.length)
  const typedFirst = firstWord.slice(0, typedFirstLen)
  const typedSecond = secondWord.slice(0, typedSecondLen)

  useEffect(() => {
    if (displayedSlogan.length < slogan.length) {
      const timer = setTimeout(() => {
        setDisplayedSlogan(slogan.slice(0, displayedSlogan.length + 1))
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setSloganComplete(true)
    }
  }, [displayedSlogan, slogan])

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
  }

  const handleCalculate = () => {
    console.log("[v0] Calculate button clicked")
    console.log("[v0] Investment amount:", investmentAmount)
    console.log("[v0] Selected option:", selectedOption)
    console.log("[v0] Selected month:", selectedMonth)
    console.log("[v0] Parsed numeric amount:", parseNumber(investmentAmount))

    if (investmentAmount && selectedOption && selectedMonth) {
      console.log("[v0] Conditions met, setting showCalculation to true")
      setTimeout(() => {
        setShowCalculation(true)
      }, 0)
    } else {
      console.log("[v0] Conditions not met - missing data")
    }
  }

  const handleReset = () => {
    setSelectedOption(null)
    setInvestmentAmount("")
    setSelectedMonth("")
    setShowCalculation(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleCalculate()
    }
  }

  const numericAmount = parseNumber(investmentAmount)
  const downPayment = numericAmount ? (Number.parseFloat(numericAmount) * 0.2).toLocaleString("tr-TR") : "0"
  const workingFee = numericAmount ? (Number.parseFloat(numericAmount) * 0.08) : "0"

  const generatePaymentSchedule = (isAfterDownPayment) => {
    if (!numericAmount || !selectedMonth) return []

    const amount = Number.parseFloat(numericAmount)
    const deliveryMonth = Number.parseInt(selectedMonth)
    // Ev ve araba için aynı kurallar kullanılacak
    // 1.000.000 TL başına: preMonthly (teslimat öncesi), afterMonthly (teslimat sonrası sabit), final (son ay), totalTerm (toplam ay)
    const CONFIG = {
      2: { preMonthly: 37000, afterMonthly: 44500, final: 88500, totalTerm: 18 },
      3: { preMonthly: 31266, afterMonthly: 38766, final: 77180, totalTerm: 21 },
      4: { preMonthly: 25600, afterMonthly: 33100, final: 65600, totalTerm: 25 },
      5: { preMonthly: 22500, afterMonthly: 30000, final: 57500, totalTerm: 28 },
      6: { preMonthly: 20000, afterMonthly: 27500, final: 50000, totalTerm: 31 },
      7: { preMonthly: 18333, afterMonthly: 25833, final: 30011, totalTerm: 34 },
      8: { preMonthly: 17667, afterMonthly: 22667, final: 43988, totalTerm: 37 },
      9: { preMonthly: 16134, afterMonthly: 21134, final: 40800, totalTerm: 40 },
    }
    const config = CONFIG[deliveryMonth]
    if (!config) return []

    const months = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ]

    const currentMonthIndex = new Date().getMonth() // 0=Ocak
    const deliveryIndex = deliveryMonth - 1

    // Teslimat öncesi ay sayısı: bulunduğumuz aydan teslim ayına kadar (dahil)
    let preMonths = ((deliveryIndex - currentMonthIndex + 12) % 12) + 1
    // Eylül özel durumu: aynı ay seçilirse bir sonraki yıl Eylül kabul (13 ay)
    if (deliveryMonth === 9 && currentMonthIndex === 8) {
      preMonths = 13
    }

    if (!isAfterDownPayment) {
      const schedule = []
      const monthlyPayment = (config.preMonthly * amount) / 1000000
      for (let i = 0; i < preMonths; i++) {
        const monthIndex = (currentMonthIndex + i) % 12
        const isDelivery = i === preMonths - 1
        schedule.push({
          number: i + 1,
          amount: isDelivery ? (monthlyPayment + workingFee).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :monthlyPayment.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          month: isDelivery ? `${months[monthIndex]} (Teslimat)` : months[monthIndex],
        })
      }
      return schedule
    } else {
      const schedule = []
      let paymentNumber = preMonths + 1
      const postMonths = Math.max(0, config.totalTerm - preMonths)
      const phasePayment = (config.afterMonthly * amount) / 1000000
      for (let i = 0; i < Math.max(0, postMonths - 1); i++) {
        const monthIndex = (currentMonthIndex + preMonths + i) % 12
        schedule.push({
          number: paymentNumber++,
          amount: phasePayment.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          month: months[monthIndex],
        })
      }
      if (postMonths > 0) {
        const finalPayment = (config.final * amount) / 1000000
        const finalMonthIndex = (currentMonthIndex + preMonths + Math.max(0, postMonths - 1)) % 12
        schedule.push({
          number: paymentNumber,
          amount: finalPayment.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          month: months[finalMonthIndex],
        })
      }
      return schedule
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    const formatted = formatNumber(value)
    setInvestmentAmount(formatted)
  }

  if (showCalculation) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-start p-8">
        <div className="text-center mb-8">
          <Image src="/iyi-finans-logo.png" alt="İyi Finans" width={400} height={200} className="mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-8">
            <span style={{ color: "#00339F" }}>{firstWord}</span>
            {" "}
            <span style={{ color: "#10CCC9" }}>{secondWord}</span>
          </h1>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 text-2xl font-semibold mb-4">
            <span className="text-secondary">{selectedOption === "ev" ? "Konut" : "Araba"}</span>
            <span className="text-foreground">{investmentAmount} ₺</span>
            <span className="text-accent">({monthOptions.find((m) => m.value === selectedMonth)?.label})</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-primary font-semibold">{downPayment} ₺</span>
              <span className="text-muted-foreground">Peşinat (%20)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-accent font-semibold">{workingFee.toLocaleString("tr-TR")} ₺</span>
              <span className="text-muted-foreground">Çalışma Bedeli (%8)</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <Tabs defaultValue="before" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="before" className="text-base">
                Teslimat Öncesi
              </TabsTrigger>
              <TabsTrigger value="after" className="text-base">
                Teslimat Sonrası
              </TabsTrigger>
            </TabsList>

            <div className="text-center mb-6">
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-6 py-2 text-base hover:bg-secondary hover:text-secondary-foreground bg-transparent"
              >
                🔄 Tekrar Hesapla
              </Button>
            </div>

            <TabsContent value="before" className="space-y-4">
              <div className="bg-card rounded-lg p-6">
                <div className="space-y-3">
                  {generatePaymentSchedule(false).map((item) => (
                    <div key={item.number} className="grid grid-cols-3 gap-4 py-2">
                      <div className="text-center font-medium">{item.number}</div>
                      <div className="text-center">{item.amount} ₺</div>
                      <div className="text-center">{item.month}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-secondary/10 rounded-lg">
                      <div className="text-base text-muted-foreground mb-1">Toplam Ödenen</div>
                      <div className="text-xl font-semibold text-primary">
                        {(() => {
                          const schedule = generatePaymentSchedule(false)
                          const total = schedule.reduce((sum, item) => {
                            return sum + Number.parseFloat(item.amount.replace(/\./g, "").replace(",", "."))
                          }, 0)
                          return total.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        })()} ₺
                      </div>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <div className="text-base text-muted-foreground mb-1">Kalan</div>
                      <div className="text-xl font-semibold text-accent">
                        {(() => {
                          const schedule = generatePaymentSchedule(false)
                          const totalPaid = schedule.reduce((sum, item) => {
                            return sum + Number.parseFloat(item.amount.replace(/\./g, "").replace(",", "."))
                          }, 0)
                          const remaining = Number.parseFloat(numericAmount) - totalPaid
                          return remaining.toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        })()} ₺
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="after" className="space-y-4">
              <div className="bg-card rounded-lg p-6">
                <div className="space-y-3">
                  {generatePaymentSchedule(true).map((item) => (
                    <div key={item.number} className="grid grid-cols-3 gap-4 py-2">
                      <div className="text-center font-medium">{item.number}</div>
                      <div className="text-center">{item.amount} ₺</div>
                      <div className="text-center">{item.month}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-secondary/10 rounded-lg">
                      <div className="text-base text-muted-foreground mb-1">Toplam Vade</div>
                      <div className="text-xl font-semibold text-primary">
                        {(() => {
                          const beforeCount = generatePaymentSchedule(false).length
                          const afterCount = generatePaymentSchedule(true).length
                          const totalMonths = beforeCount + afterCount
                          return `${totalMonths} ay`
                        })()}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <div className="text-base text-muted-foreground mb-1">Toplam Maliyet</div>
                      <div className="font-semibold text-accent">
                        {(() => {
                          const amount = Number.parseFloat(numericAmount || "0")
                          const totalCost = amount * 1.08
                          return totalCost.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        })()} ₺
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <Image src="/iyi-finans-logo.png" alt="İyi Finans" width={400} height={200} className="mx-auto mb-6" />

        <div className="h-16 flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold">
            <span style={{ color: "#00339F" }}>{typedFirst}</span>
            {typedSecond && <span>{" "}</span>}
            <span style={{ color: "#10CCC9" }}>{typedSecond}</span>
            {!sloganComplete && <span className="animate-pulse">|</span>}
          </h1>
        </div>
      </div>

      {sloganComplete && !selectedOption && (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Hangi Finansman?</h2>

          <div className="flex gap-6">
            <Button
              onClick={() => handleOptionSelect("ev")}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              🏠 Konut
            </Button>
            <Button
              onClick={() => handleOptionSelect("araba")}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              🚗 Araba
            </Button>
          </div>
        </div>
      )}

      {selectedOption && !showCalculation && (
        <div className="text-center space-y-6 animate-in slide-in-from-bottom duration-500">
          <div className="text-3xl font-bold text-secondary capitalize mb-6 transform scale-110">
            {selectedOption === "ev" ? "🏠 Konut" : "🚗 Araba"}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-lg font-medium text-foreground">Ne kadarlık yatırım yapacaksınız?</label>
              <div className="flex items-center gap-4 max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Yatırım miktarı"
                  value={investmentAmount}
                  onChange={handleAmountChange}
                  onKeyPress={handleKeyPress}
                  className="text-lg py-3"
                />
                <span className="text-lg font-medium">₺</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-lg font-medium text-foreground">Hangi ay teslim almak istiyorsunuz?</label>
              <div className="max-w-md mx-auto">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="text-lg py-3">
                    <SelectValue placeholder="Teslim ayını seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleCalculate}
              disabled={!investmentAmount || !selectedMonth}
              className="px-8 py-3 text-lg bg-primary hover:bg-secondary"
              type="button"
            >
              Hesapla
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { af, ca } from "date-fns/locale"
import { NumericFormat } from 'react-number-format';

export default function IyiFinansCampaign() {
  const [displayedSlogan, setDisplayedSlogan] = useState("")
  const [sloganComplete, setSloganComplete] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [showCalculation, setShowCalculation] = useState(false)
  const [downPaymentOption, setDownPaymentOption] = useState(null)
  const [recalculatedPlanResult, setRecalculatedPlanResult] = useState(null);
  const [activeTab, setActiveTab] = useState("before");
  const [initialDownPaymentOption, setInitialDownPaymentOption] = useState(null);
  const [notification, setNotification] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [installmentType, setInstallmentType] = useState('sabit');

  const slogan = "Sen Evine Erken Kavuş Diye"

  const monthOptions = [
    { value: "3", label: "Mart" },
    { value: "4", label: "Nisan" },
    { value: "5", label: "Mayıs" },
    { value: "6", label: "Haziran" },
    { value: "7", label: "Temmuz" },
    { value: "8", label: "Ağustos" },
    { value: "9", label: "Eylül" },
    { value: "10", label: "Ekim" },
  ]

  const formatNumber = (value) => {
    if (!value) return ""
    const numericValue = value.toString().replace(/\D/g, "")
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const words = slogan.split(' ');
  const colors = ["#0C3960", "#FC851F"]; // Mevcut renkleriniz
  let charCount = 0;

  const typedWords = words.map((word, index) => {
    const start = charCount;
    const end = start + word.length;
    charCount = end + 1; // Boşluk için +1 ekle

    const typedLength = Math.max(0, displayedSlogan.length - start);
    const typedWord = word.slice(0, typedLength);

    return (
      <span key={index} style={{ color: colors[index % 2] }}>
        {typedWord}
      </span>
    );
  });

  useEffect(() => {
    if (displayedSlogan.length < slogan.length) {
      const timer = setTimeout(() => {
        setDisplayedSlogan(slogan.slice(0, displayedSlogan.length + 1))
      }, 75)
      return () => clearTimeout(timer)
    } else {
      const delayTimer = setTimeout(() => {
        setSloganComplete(true)
      }, 300); 
      return () => clearTimeout(delayTimer);
    }
  }, [displayedSlogan, slogan])

  useEffect(() => {
    if (notification) {
      // 5 saniye sonra fade-out animasyonunu başlat
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 5000); // 5 saniye bekle

      // Animasyonun bitmesini bekle (500ms), sonra tamamen kaldır
      const removeTimer = setTimeout(() => {
        setNotification("");
        setIsFadingOut(false); // State'i temizle
      }, 5500); // 5 saniye + 500ms animasyon süresi

      // Temizlik fonksiyonu
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [notification]);

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
    setDownPaymentOption(null)
    setRecalculatedPlanResult(null)
    setInitialDownPaymentOption(null)
    setNotification("")
    setInstallmentType('sabit')
  }

  const parseNumber = (formattedValue) => {
    if (!formattedValue) return ""
    return formattedValue.replace(/\./g, "")
  }

  let workingFee
  const numericAmount = parseNumber(investmentAmount)
  let downPayment;
  if (recalculatedPlanResult) {
    downPayment = recalculatedPlanResult.calculatedDownPayment;
  } else {
    downPayment =
      numericAmount && downPaymentOption === "pesinatli"
        ? Number.parseFloat(numericAmount) * 0.20
        : "0";
  }
  if (downPaymentOption === "pesinatli" || downPaymentOption === "yuksekpesinatli") {
    workingFee = numericAmount ? (Number.parseFloat(numericAmount) * 0.08) : "0"
  } else {
    workingFee = numericAmount ? (Number.parseFloat(numericAmount) * 0.07) : "0"
  }

  const monthlyPP_WithDownPayment = (investment_Amount, pre_Month) => {
    const originalDelivery = pre_Month * 10 / 8
    const totalTerm = Math.floor(originalDelivery * 10 / 4)
    let preMonthly;
    let afterMonthly;
    let final;

    console.log(pre_Month)

    if (installmentType === 'artisli') {
      switch (pre_Month) {
        case 6:
          preMonthly = 37000; afterMonthly = 44500; final = 88500; break;
        case 7:
          preMonthly = 31266; afterMonthly = 38766; final = 77180; break;
        case 8:
          preMonthly = 25600; afterMonthly = 33100; final = 65600; break;
        case 9:
          preMonthly = 22500; afterMonthly = 30000; final = 57500; break;
        case 10:
          preMonthly = 20000; afterMonthly = 27500; final = 50000; break;
        case 11:
          preMonthly = 18333; afterMonthly = 25833; final = 30011; break;
        case 12:
          preMonthly = 17667; afterMonthly = 22667; final = 43988; break;
        case 13:
          preMonthly = 16134; afterMonthly = 21134; final = 40800; break;
      }

      preMonthly = preMonthly * investment_Amount / 1000000
      afterMonthly = afterMonthly * investment_Amount / 1000000
      final = final * investment_Amount / 1000000
    }
    else {
      preMonthly = Math.ceil((investment_Amount * 0.8) / totalTerm)
      afterMonthly = preMonthly
      final = (investment_Amount * 0.8) - ((preMonthly * pre_Month) + afterMonthly * (totalTerm - 1 - pre_Month))
    }
    return { preMonthly, afterMonthly, final, totalTerm }
  }

  const monthlyPP_WithoutDownPayment = (investment_Amount, pre_Month) => {
    const totalTerm = Math.floor(pre_Month * 100 / 40)
    const preMonthly = Math.ceil(investment_Amount / totalTerm)
    console.log(preMonthly)
    const afterMonthly = preMonthly
    const final = investment_Amount - (preMonthly * (totalTerm - 1))
    return { preMonthly, afterMonthly, final, totalTerm }
  }

  const calculateNewPlan = (desiredMaturity) => {
    const amount = Number.parseFloat(numericAmount)
    const deliveryMonth = Number.parseInt(selectedMonth)

    const currentMonthIndex = new Date().getMonth()
    const deliveryIndex = deliveryMonth - 1

    let preMonths = ((deliveryIndex - currentMonthIndex + 12) % 12) + 1
    if (deliveryMonth === 10 && currentMonthIndex === 9) {
      preMonths = 13
    }

    const fourtyPercentOfT_T = desiredMaturity * 0.4
    const thePartOfWeDontWant = fourtyPercentOfT_T - preMonths;
    let percentageOfDownPayment;
    if (thePartOfWeDontWant < 0)
      percentageOfDownPayment = 0
    else percentageOfDownPayment = (100 * thePartOfWeDontWant) / fourtyPercentOfT_T;

    const calculatedDownPayment = amount * percentageOfDownPayment / 100;

    const totalTerm = desiredMaturity;
    const preMonthly = Math.ceil((amount - (amount * percentageOfDownPayment / 100)) / totalTerm)
    const afterMonthly = preMonthly
    const final = (amount - (amount * percentageOfDownPayment / 100)) - (preMonthly * (totalTerm - 1))

    return { preMonthly, afterMonthly, final, totalTerm, calculatedDownPayment }
  };

  const handleRecalculatePlan = (desiredMaturity, currentDownPayment, currentMonthlyPayment) => {
    const newPlan = calculateNewPlan(desiredMaturity);
    setRecalculatedPlanResult(newPlan);

    const newDownPayment = newPlan.calculatedDownPayment - currentDownPayment;
    const newMonthlyPayment = newPlan.afterMonthly - currentMonthlyPayment;

    let message;

    if (newDownPayment < 0)
      message = `Bu planınızda: Peşinatınız ${-(newDownPayment.toLocaleString("tr-TR", { maximumFractionDigits: 0 }))} ₺ azaldı Taksitleriniz ${newMonthlyPayment.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺ arttı.`;
    else
      message = `Bu planınızda: Peşinatınız ${newDownPayment.toLocaleString("tr-TR", { maximumFractionDigits: 0 })} ₺ arttı ve Taksitleriniz ${-(newMonthlyPayment.toLocaleString("tr-TR", { maximumFractionDigits: 0 }))} ₺ azaldı.`;
    setNotification(message);
    setIsFadingOut(false);

    const amount = Number.parseFloat(numericAmount || "0");
    const calculatedDownPayment = newPlan.calculatedDownPayment;

    if (calculatedDownPayment >= amount * 0.2)
      setDownPaymentOption('yuksekpesinatli');
    else if (calculatedDownPayment === 0)
      setDownPaymentOption('pesinatsiz');
    else setDownPaymentOption('dusukpesinatli');

    setActiveTab("before");
    window.scrollTo({ top: 1, behavior: 'smooth' });
  };

  const generatePaymentSchedule = (isAfterDownPayment) => {
    if (!numericAmount || !selectedMonth) return []

    const amount = Number.parseFloat(numericAmount)
    const deliveryMonth = Number.parseInt(selectedMonth)

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
    if (deliveryMonth === 10 && currentMonthIndex === 9) {
      preMonths = 13
    }

    let plan = {};

    if (recalculatedPlanResult) {
      plan = recalculatedPlanResult;
    } else {
      if (downPaymentOption === 'pesinatsiz') {
        const rules = monthlyPP_WithoutDownPayment(amount, preMonths);
        plan = {
          preMonthly: rules.preMonthly,
          afterMonthly: rules.afterMonthly,
          final: rules.final,
          totalTerm: rules.totalTerm
        };
      } else {
        const rules = monthlyPP_WithDownPayment(amount, preMonths);
        plan = {
          preMonthly: rules.preMonthly,
          afterMonthly: rules.afterMonthly,
          final: rules.final,
          totalTerm: rules.totalTerm
        };
      }
    }

    if (!isAfterDownPayment) {
      const schedule = []
      const monthlyPayment = plan.preMonthly
      for (let i = 0; i < preMonths; i++) {
        const monthIndex = (currentMonthIndex + i) % 12
        const isDelivery = i === preMonths - 1
        schedule.push({
          number: i + 1,
          amount: isDelivery ? `${monthlyPayment.toLocaleString("tr-TR", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}` : `${monthlyPayment.toLocaleString("tr-TR", { maximumFractionDigits: 0, minimumFractionDigits: 0 })} `,
          month: isDelivery ? `${months[monthIndex]} (Teslimat)` : months[monthIndex],
        })
      }
      return schedule
    } else {
      const schedule = []
      let paymentNumber = preMonths + 1
      const postMonths = Math.floor(plan.totalTerm - preMonths)
      const regularPostPayment = plan.afterMonthly;
      const finalPostPayment = plan.final;

      for (let i = 0; i < postMonths; i++) {
        const monthIndex = (currentMonthIndex + preMonths + i) % 12;
        const isFinalMonth = (i === postMonths - 1);
        const paymentAmount = isFinalMonth ? finalPostPayment : regularPostPayment;

        schedule.push({
          number: paymentNumber++,
          amount: paymentAmount.toLocaleString("tr-TR", { maximumFractionDigits: 0 }),
          month: months[monthIndex],
        })
      }
      return schedule
    }
  }

  const handleGoBack = () => {
    setDownPaymentOption(null);
    setInvestmentAmount("");
    setSelectedMonth("");
    setRecalculatedPlanResult(null);
  }


  if (showCalculation) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-start p-8">
        <div className="text-center mb-8">
          <Image src="/enIyiKampanya-logo.png" alt="En İyi Kampanya" width={400} height={200} className="mx-auto mb-6" />
          <h1 className="text-4xl font-bold">
            {typedWords.map((wordElement, index) => (
              <span key={index}>
                {wordElement}
                {index < words.length - 1 && ' '}
              </span>
            ))}
            {!sloganComplete && <span className="animate-pulse">|</span>}
          </h1>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 text-2xl font-semibold mb-4">
            <span className="text-secondary">{selectedOption === "ev" ? "Konut" : "Araba"}</span>
            <div className="flex items-center gap-2">
              <NumericFormat
                value={investmentAmount}
                onValueChange={(values) => setInvestmentAmount(values.value)}
                thousandSeparator="."
                decimalSeparator=","
                customInput={Input}
                className="w-48 text-2xl font-semibold text-center text-foreground bg-transparent border-b-2 border-primary focus:outline-none focus:ring-0"
                onFocus={(e) => e.target.select()}
              />
              <span className="text-foreground">₺</span>
            </div>
          </div>

          <div className="space-y-3" width="250">
            <div className="flex items-center justify-center gap-2">
              <span className="text-foreground font-semibold">Peşinat (İlk Ödeme)</span>
              <span className="text-primary font-semibold text-xl">{downPayment.toLocaleString("tr-TR", { maximumFractionDigits: 0, minimumFractionDigits: 0 })} ₺</span>
            </div>
          </div>

          {notification && (
            <div
              className={`w-full max-w-2xl p-4 mb-4 flex items-center justify-between 
                         bg-emerald-800/90 backdrop-blur-sm border border-emerald-600 
                         rounded-lg shadow-lg duration-500 
                         ${!isFadingOut ? 'animate-in fade-in' : 'animate-out fade-out'}`}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">ℹ️</span>
                <p className="text-sm text-emerald-100">{notification}</p>
              </div>
            </div>
          )}

          <div className="text-center mt-6">
            <Button
              onClick={handleReset}
              variant="outline"
              className="px-6 py-2 text-base hover:bg-secondary hover:text-secondary-foreground bg-transparent"
            >
              🔄 Tekrar Hesapla
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {monthOptions.map((month) => (
            <button
              key={month.value}
              onClick={() => {
                setSelectedMonth(month.value);
                setRecalculatedPlanResult(null);
                setDownPaymentOption(initialDownPaymentOption);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${selectedMonth === month.value
                ? 'bg-[#1CCECB] text-white'
                : 'bg-[#FFFFFF] text-gray-800 hover:bg-gray-300'
                }`}
            >
              {month.label}
            </button>
          ))}
        </div>

        {downPaymentOption === 'pesinatli' && (
          <div className="flex justify-center gap-4 my-6">
            <Button
              onClick={() => setInstallmentType('sabit')}
              variant={installmentType === 'sabit' ? 'default' : 'outline'}
              className="transition-all"
            >
              Sabit Taksit
            </Button>
            <Button
              onClick={() => setInstallmentType('artisli')}
              variant={installmentType === 'artisli' ? 'default' : 'outline'}
              className="transition-all"
            >
              Artışlı Taksit
            </Button>
          </div>
        )}

        {(downPaymentOption === 'pesinatsiz' || downPaymentOption === 'dusukpesinatli' || downPaymentOption === 'yuksekpesinatli') && (() => {
          // Peşinat oranı kontrolü
          const currentDownPaymentPercentage = numericAmount > 0 ? (downPayment / numericAmount) * 100 : 0;
          if (currentDownPaymentPercentage >= 40) {
            return null;
          }

          // 1. Gerekli tüm değişkenler burada, en üstte hesaplanır
          const beforeCount = generatePaymentSchedule(false).length
          const afterCount = generatePaymentSchedule(true).length
          const currentTotalTerm = beforeCount + afterCount

          let currentPlan = {};
          if (recalculatedPlanResult) {
            currentPlan = recalculatedPlanResult;
          } else {
            const amount = Number.parseFloat(numericAmount);
            const preMonths = beforeCount;
            currentPlan = (downPaymentOption === 'pesinatsiz')
              ? monthlyPP_WithoutDownPayment(amount, preMonths)
              : monthlyPP_WithDownPayment(amount, preMonths);
          }

          return (
            <div className="pt-4 space-y-4">
              <div className="flex justify-center gap-4 pt-2 mb-2">
                {downPaymentOption === 'pesinatsiz' ? (
                  <div className="flex flex-col items-center gap-1">
                    <Button
                      variant="outline"
                      onClick={() => handleRecalculatePlan(currentTotalTerm + 1, downPayment, currentPlan.afterMonthly)}
                    >
                      Taksit bana göre fazla
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      minimum peşinat ile taksitinizi düşürün
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="outline"
                        onClick={() => handleRecalculatePlan(currentTotalTerm + 1, downPayment, currentPlan.afterMonthly)}
                      >
                        Taksit bana göre fazla
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        minimum peşinat ile taksitinizi düşürün
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (currentTotalTerm > 1) {
                            handleRecalculatePlan(currentTotalTerm - 1, downPayment, currentPlan.afterMonthly)
                          }
                        }}
                      >
                        Peşinat bana göre fazla
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Vadeyi kısaltın, peşinatı azaltın.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })()}

        <div className="w-full max-w-2xl mt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="before" className="text-base">
                Teslimat Öncesi
              </TabsTrigger>
              <TabsTrigger value="after" className="text-base">
                Teslimat Sonrası
              </TabsTrigger>
            </TabsList>
            {downPaymentOption === 'dusukpesinatli' || downPaymentOption === 'yuksekpesinatli' && (
              <p className="text-center text-lg font-semibold text-secondary mb-2">
                Minimum Peşinat Maksimum Vade
              </p>
            )}
            <TabsContent value="before">
              <div className="bg-card rounded-lg p-3">
                {downPaymentOption === 'pesinatsiz' && (
                  <>
                    <div className="grid grid-cols-3 gap-4 py-2 bg-card rounded-lg shadow-lg shadow-secondary/30">
                      <div className="text-center">Organizasyon ücreti</div>
                      <div className="flex items-center justify-center">{Number(workingFee).toLocaleString("tr-TR", { maximumFractionDigits: 0, minimumFractionDigits: 0 })} ₺</div>
                      <div className="text-center"> Başlangıçta Ödenir</div>
                    </div>
                    <div className="space-y-3">
                      {generatePaymentSchedule(false).map((item) => {
                        const isDelivery = item.month.includes("Teslimat")
                        return (
                          <div
                            key={item.number}
                            className={`grid grid-cols-3 gap-4 py-2 ${isDelivery ? "rounded-lg font-bold bg-secondary/10 text-primary shadow-lg shadow-primary/80 flex items-center justify-center" : ""}`}
                            style={isDelivery ? { color: "#1CCECB" } : {}}
                          >
                            <div className="text-center font-medium">{item.number}</div>
                            <div className="text-center">{item.amount} ₺</div>
                            <div className="text-center">{item.month}</div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}

                {downPaymentOption === 'dusukpesinatli' && (
                  <>
                    <div className="grid grid-cols-3 gap-4 py-2 bg-card rounded-lg shadow-lg shadow-secondary/30">
                      <div className="text-center">Organizasyon ücreti</div>
                      <div className="flex items-center justify-center">{Number(workingFee).toLocaleString("tr-TR", { maximumFractionDigits: 0, minimumFractionDigits: 0 })} ₺</div>
                      <div className="text-center"> Başlangıçta Ödenir</div>
                    </div>
                    <div className="space-y-3 pt-2">
                      {generatePaymentSchedule(false).map((item) => {
                        const isDelivery = item.month.includes("Teslimat")
                        return (
                          <div
                            key={item.number}
                            className={`grid grid-cols-3 gap-4 py-2 ${isDelivery ? "rounded-lg font-bold bg-secondary/10 text-primary shadow-lg shadow-primary/80 flex items-center justify-center" : ""}`}
                            style={isDelivery ? { color: "#1CCECB" } : {}}
                          >
                            <div className="text-center font-medium">{item.number}</div>
                            <div className="text-center">{item.amount} ₺</div>
                            <div className="text-center">{item.month}</div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}

                {downPaymentOption === 'yuksekpesinatli' && (
                  <>
                    <div className="space-y-3">
                      {generatePaymentSchedule(false).map((item) => {
                        const isDelivery = item.month.includes("Teslimat")
                        return (
                          <div
                            key={item.number}
                            className={`grid grid-cols-3 gap-4 py-2 ${isDelivery ? "rounded-t-lg font-bold bg-secondary/10 text-primary shadow-lg shadow-primary/80 flex items-center justify-center" : ""}`}
                            style={isDelivery ? { color: "#1CCECB" } : {}}
                          >
                            <div className="text-center font-medium">{item.number}</div>
                            <div className="text-center">{item.amount} ₺</div>
                            <div className="text-center">{item.month}</div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 bg-card rounded-b-lg shadow-lg shadow-secondary/30">
                      <div className="text-center">Organizasyon ücreti</div>
                      <div className="flex items-center justify-center">{Number(workingFee).toLocaleString("tr-TR", { maximumFractionDigits: 0, minimumFractionDigits: 0 })} ₺</div>
                      <div className="text-center">Teslimatta öde</div>
                    </div>
                  </>
                )}

                {downPaymentOption === 'pesinatli' && (
                  <>
                    <div className="space-y-3">
                      {generatePaymentSchedule(false).map((item) => {
                        const isDelivery = item.month.includes("Teslimat")
                        return (
                          <div
                            key={item.number}
                            className={`grid grid-cols-3 gap-4 py-2 ${isDelivery ? "rounded-t-lg font-bold bg-secondary/10 text-primary shadow-lg shadow-primary/80 flex items-center justify-center" : ""}`}
                            style={isDelivery ? { color: "#1CCECB" } : {}}
                          >
                            <div className="text-center font-medium">{item.number}</div>
                            <div className="text-center">{item.amount} ₺</div>
                            <div className="text-center">{item.month}</div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2 bg-card rounded-b-lg shadow-lg shadow-secondary/30">
                      <div className="text-center">Organizasyon ücreti</div>
                      <div className="flex items-center justify-center">{Number(workingFee).toLocaleString("tr-TR", { maximumFractionDigits: 0, minimumFractionDigits: 0 })} ₺</div>
                      <div className="text-center">Teslimatta öde</div>
                    </div>
                  </>
                )}

                <div className="mt-6 pt-4 border-t border-border space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-secondary/10 rounded-lg">
                      <div className="text-base text-muted-foreground mb-1">Toplam Ödenen</div>
                      <div className="text-base font-semibold text-primary">
                        {(() => {
                          const schedule = generatePaymentSchedule(false)
                          const total = schedule.reduce((sum, item) => {
                            return sum + Number.parseFloat(item.amount.replace(/\./g, "").replace(",", "."))
                          }, 0)
                          const finalTotal = Number(total) + Number(workingFee) + Number(downPayment);
                          return finalTotal.toLocaleString("tr-TR", { maximumFractionDigits: 0, minimumFractionDigits: 0 });
                        })()} ₺
                      </div>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <div className="text-base text-muted-foreground mb-1">Kalan</div>
                      <div className="text-base font-semibold text-accent">
                        {(() => {
                          const schedule = generatePaymentSchedule(false)
                          const totalPaid = schedule.reduce((sum, item) => {
                            return sum + Number.parseFloat(item.amount.replace(/\./g, "").replace(",", "."))
                          }, 0)
                          const remaining = Number.parseFloat(numericAmount) - totalPaid - downPayment
                          return remaining.toLocaleString("tr-TR", { maximumFractionDigits: 0, minimumFractionDigits: 0 })
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
                          const amount = Number.parseFloat(numericAmount || "0");
                          let totalCost;
                          if (downPaymentOption === 'pesinatli') {
                            totalCost = amount * 1.08;
                          } else {
                            totalCost = amount * 1.07;
                          }
                          return totalCost.toLocaleString("tr-TR", { maximumDigits: 0 })
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
        <Image src="/enIyiKampanya-logo.png" alt="En İyi Kampanya" width={400} height={200} className="mx-auto mb-6" />

        <div className="h-16 flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold">
            {typedWords.map((wordElement, index) => (
              <span key={index}>
                {wordElement}
                {index < words.length - 1 && ' '}
              </span>
            ))}
            {!sloganComplete && <span className="animate-pulse">|</span>}
          </h1>
        </div>
      </div>

      {sloganComplete && !selectedOption && (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Finansman Türü?</h2>

          <div className="flex gap-6">
            <Button
              onClick={() => handleOptionSelect("ev")}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/50"
            >
              🏠 Konut
            </Button>
            <Button
              onClick={() => handleOptionSelect("araba")}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/50"
            >
              🚗 Araba
            </Button>
          </div>
        </div>
      )}

      {sloganComplete && selectedOption && !downPaymentOption && !showCalculation && (
        <div className="text-center space-y-6 animate-in slide-in-from-bottom duration-500">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Ödeme Planını Seç?</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={() => {
                  setDownPaymentOption("pesinatli");
                  setInitialDownPaymentOption("pesinatli");
                }}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/50"
              >
                Açılışa Özel Fırsat
              </Button>
              <p className="text-xs text-muted-foreground max-w-xs">
                Sen evine erken kavuş diye organizasyon ücretini teslimata öteledik.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={() => {
                  setDownPaymentOption("pesinatsiz");
                  setInitialDownPaymentOption("pesinatsiz");
                }}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg shadow-primary/50"
              >
                Esnek Ödeme Kampanyası
              </Button>
              <p className="text-xs text-muted-foreground max-w-xs">
                Teslimat ayına göre en düşük peşinat ve en uygun taksiti bul!
              </p>
            </div>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => setSelectedOption(null)}
              variant="outline"
              className="px-6 py-2 text-base hover:bg-secondary hover:text-secondary-foreground bg-transparent"
            >
              🔄 Geri Dön
            </Button>
          </div>
        </div>
      )}

      {sloganComplete && selectedOption && downPaymentOption && !showCalculation && (
        <div className="text-center space-y-6 animate-in slide-in-from-bottom duration-500">
          <div className="text-3xl font-bold text-secondary capitalize mb-6 transform scale-110">
            {selectedOption === "ev" ? "🏠 Konut" : "🚗 Araba"}
            {" - "}
            <span className="capitalize">{downPaymentOption === 'pesinatli' ? 'Peşinatlı' : 'Peşinatsız'}</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-lg font-medium text-foreground">Ne kadarlık yatırım yapacaksınız?</label>
              <div className="flex items-center gap-4 max-w-md mx-auto ">
                <NumericFormat
                  value={investmentAmount}
                  onValueChange={(values) => {
                    setInvestmentAmount(values.value);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  customInput={Input} // Bu, bizim kendi Input component'imizi kullanmasını sağlar
                  placeholder="Finansman tutarınızı girin"
                  className="text-sm py-3 text-muted-foreground placeholder:text-muted-foreground/70"
                  onFocus={(e) => e.target.select()} // Tıklayınca tüm yazıyı seçer
                />
                <span className="text-lg font-medium">₺</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-lg font-medium text-foreground">Hangi ay teslim almak istiyorsunuz?</label>
              <div className="max-w-md mx-auto">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="text-lg py-3">
                    <SelectValue placeholder={<span className="text-muted-foreground/70 text-sm">Teslim ayını seçin</span>} />
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

            <span className="mr-2">
              <Button
                onClick={handleCalculate}
                disabled={!investmentAmount || !selectedMonth}
                className="px-8 py-3 text-lg bg-primary hover:bg-secondary"
                type="button"
              >
                Hesapla
              </Button>
            </span>
            <span className="ml-2">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="px-6 py-2 text-base hover:bg-secondary hover:text-secondary-foreground bg-transparent"
              >
                🔄 Geri Dön
              </Button>
            </span>
          </div>

        </div>
      )}
    </div>
  )
}

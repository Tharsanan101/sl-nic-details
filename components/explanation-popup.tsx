import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface ExplanationPopupProps {
  isOpen: boolean
  onClose: () => void
  nicNumber: string
  birthDate: string | null
  gender: string | null
  age: number | null
}

export function ExplanationPopup({ isOpen, onClose, nicNumber, birthDate, gender, age }: ExplanationPopupProps) {
  const isOldFormat = nicNumber.length === 10

  const getYearExplanation = () => {
    if (isOldFormat) {
      const year = nicNumber.substring(0, 2)
      const fullYear = parseInt(year) + (parseInt(year) < 50 ? 2000 : 1900)
      return `The first two digits (${year}) represent the year ${fullYear}.`
    } else {
      const year = nicNumber.substring(0, 4)
      return `The first four digits (${year}) directly represent the birth year.`
    }
  }

  const getDaysExplanation = () => {
    const daysStr = isOldFormat ? nicNumber.substring(2, 5) : nicNumber.substring(4, 7)
    const days = parseInt(daysStr)
    const actualDays = days > 500 ? days - 500 : days
    const date = new Date(isOldFormat ? 
      (parseInt(nicNumber.substring(0, 2)) < 50 ? 2000 : 1900) + parseInt(nicNumber.substring(0, 2)) : 
      parseInt(nicNumber.substring(0, 4)), 0)
    date.setDate(actualDays)
    
    return {
      original: daysStr,
      actual: actualDays,
      date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    }
  }

  const daysInfo = getDaysExplanation()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Understanding Your NIC Number Structure</DialogTitle>
          <DialogDescription>
            Breaking down the components of {nicNumber}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[400px] pr-4">
          <div className="space-y-6">
            {/* Format Type Section */}
            <section>
              <h3 className="text-base font-semibold mb-2">Format Overview</h3>
              <p className="text-sm text-muted-foreground">
                This NIC follows the {isOldFormat ? "old (9 digits + V/X)" : "new (12 digits)"} format structure.
              </p>
            </section>
            
            <Separator />
            
            {/* Birth Year Section */}
            <section>
              <h3 className="text-base font-semibold mb-2">Birth Year Component</h3>
              <p className="text-sm text-muted-foreground">{getYearExplanation()}</p>
            </section>
            
            <Separator />
            
            {/* Days Explanation Section */}
            <section>
              <h3 className="text-base font-semibold mb-2">Day of Year Calculation</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>The next three digits ({daysInfo.original}) in your NIC represent a specific day of the year:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Each year has 365 days (366 in leap years)</li>
                  <li>Your day number is: {daysInfo.actual}</li>
                  <li>This corresponds to: {daysInfo.date}</li>
                </ul>
                <div className="mt-2 text-xs bg-muted/50 p-2 rounded">
                  📅 Fun fact: This system allows precise date tracking while maintaining a compact format!
                </div>
              </div>
            </section>
            
            <Separator />
            
            {/* Gender Determination Section */}
            <section>
              <h3 className="text-base font-semibold mb-2">Gender Encoding System</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Gender is cleverly encoded in the day number:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Numbers 1-366: Male</li>
                  <li>Numbers 501-866: Female (original number minus 500)</li>
                </ul>
                <div className="mt-2">
                  In your case: {daysInfo.original} {parseInt(daysInfo.original) > 500 ? 
                    `(> 500, therefore female, actual day is ${daysInfo.actual})` : 
                    `(≤ 500, therefore male)`}
                </div>
                <div className="mt-2 text-xs bg-muted/50 p-2 rounded">
                  ℹ️ This ingenious system allows encoding both date and gender in just three digits!
                </div>
              </div>
            </section>
            
            <Separator />
            
            {/* Summary Section */}
            <section>
              <h3 className="text-base font-semibold mb-2">Your NIC Summary</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>🗓 Birth Date: {birthDate}</p>
                <p>👤 Gender: {gender}</p>
                <p>⏳ Current Age: {age} years</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}


"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Check,
  ChevronRight,
  ChevronLeft,
  Lock,
  RotateCcw,
  Truck,
  Shield,
  Gem,
  Sparkles,
  MapPin,
  User,
  CreditCard,
  ClipboardList,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useCart } from "@/store/use-cart";
import { useUI } from "@/store/use-ui";
import { BRAND, COUPONS } from "@/data/catalog";
import type { CartItem } from "@/lib/types";
import {
  cn,
  formatPrice,
  whatsappLink,
  buildWhatsAppOrderMessage,
} from "@/lib/utils";
import { WhatsAppIcon } from "@/components/zariya/product-card";

/* -------------------------------------------------------------------------- */
/*  Schemas                                                                   */
/* -------------------------------------------------------------------------- */

const step1Schema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 10, "Phone must be exactly 10 digits"),
});

const step2Schema = z.object({
  address: z.string().trim().min(6, "Please enter a complete street address"),
  city: z.string().trim().min(2, "Please enter your city"),
  state: z.string().trim().min(2, "Please enter your state"),
  pincode: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 6, "Pincode must be 6 digits"),
  country: z.string().trim().min(2, "Please select your country"),
  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters").optional().or(z.literal("")),
});

const step3Schema = z.object({
  paymentMethod: z.enum(
    ["COD", "ONLINE"],
    { message: "Please select a payment method" }
  ),
});

type FormState = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  notes: string;
  paymentMethod: "COD" | "ONLINE";
};

const INITIAL_FORM: FormState = {
  customerName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  notes: "",
  paymentMethod: "COD",
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function computeDiscount(couponCode: string | null, subtotal: number) {
  if (!couponCode) return 0;
  const coupon = COUPONS.find(
    (c) => c.code.toUpperCase() === couponCode.toUpperCase()
  );
  if (!coupon) return 0;
  if (subtotal < coupon.minOrder) return 0;
  if (coupon.type === "percent")
    return Math.round((subtotal * coupon.value) / 100);
  return Math.min(coupon.value, subtotal);
}

const STEPS = [
  { id: 1, label: "Details", icon: User },
  { id: 2, label: "Shipping", icon: MapPin },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Review", icon: ClipboardList },
];

const TRUST_BADGES = [
  { icon: Lock, label: "Secure checkout" },
  { icon: RotateCcw, label: "7-day returns" },
  { icon: Gem, label: "Authenticity guaranteed" },
  { icon: Sparkles, label: "Handcrafted" },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function CheckoutModal() {
  const checkoutOpen = useUI((s) => s.checkoutOpen);
  const closeCheckout = useUI((s) => s.closeCheckout);
  const closeCart = useCart((s) => s.closeCart);

  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const couponCode = useCart((s) => s.couponCode);
  const clearCart = useCart((s) => s.clear);

  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [placing, setPlacing] = React.useState(false);
  const [placedOrder, setPlacedOrder] = React.useState<{
    orderNumber: string;
    email: string;
    name: string;
    items: CartItem[];
    total: number;
    couponCode: string | null;
  } | null>(null);

  const discount = React.useMemo(
    () => computeDiscount(couponCode, subtotal),
    [couponCode, subtotal]
  );
  const shipping = 0;
  const total = Math.max(0, subtotal - discount + shipping);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!checkoutOpen) {
      const t = setTimeout(() => {
        setStep(1);
        setErrors({});
        setPlacing(false);
        // Keep success state until closed, then clear
        setPlacedOrder(null);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [checkoutOpen]);

  // Lock body scroll when modal open
  const setField = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validateStep = (current: number): boolean => {
    try {
      if (current === 1) {
        step1Schema.parse({
          customerName: form.customerName,
          email: form.email,
          phone: form.phone,
        });
      } else if (current === 2) {
        step2Schema.parse({
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country,
          notes: form.notes,
        });
      } else if (current === 3) {
        step3Schema.parse({ paymentMethod: form.paymentMethod });
      } else if (current === 4) {
        // Final check — re-run all schemas
        step1Schema.parse({
          customerName: form.customerName,
          email: form.email,
          phone: form.phone,
        });
        step2Schema.parse({
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country,
          notes: form.notes,
        });
        step3Schema.parse({ paymentMethod: form.paymentMethod });
        if (items.length === 0) {
          setErrors({ items: "Your bag is empty" });
          return false;
        }
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const next: Record<string, string> = {};
        for (const issue of err.issues) {
          const key = issue.path[0];
          if (typeof key === "string" && !next[key]) next[key] = issue.message;
        }
        setErrors(next);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(4, s + 1));
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handlePlaceOrder = async () => {
    if (!validateStep(4)) {
      toast.error("Please complete all required fields");
      return;
    }
    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }

    setPlacing(true);
    try {
      const payload = {
        customerName: form.customerName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        country: form.country.trim(),
        notes: form.notes.trim() || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          slug: i.slug,
          name: i.name,
          price: i.price,
          image: i.image,
          color: i.color,
          size: i.size,
          quantity: i.quantity,
          stock: i.stock,
        })),
        subtotal,
        discount,
        shipping,
        total,
        couponCode: couponCode || undefined,
        paymentMethod: form.paymentMethod,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to place order");
      }

      // Preserve snapshot for success screen + WhatsApp BEFORE clearing cart
      setPlacedOrder({
        orderNumber: data.order.orderNumber,
        email: payload.email,
        name: payload.customerName,
        items: [...items],
        total,
        couponCode,
      });

      clearCart();
      closeCart();
      toast.success("Order placed successfully", {
        description: `Order ${data.order.orderNumber}`,
      });
    } catch (err) {
      console.error("[CHECKOUT_PLACE_ORDER]", err);
      toast.error("Could not place order", {
        description:
          err instanceof Error ? err.message : "Please try again or contact concierge",
      });
    } finally {
      setPlacing(false);
    }
  };

  const handleContinueShopping = () => {
    closeCheckout();
  };

  const handleTrackWhatsApp = () => {
    if (!placedOrder) return;
    const msg = buildWhatsAppOrderMessage({
      items: placedOrder.items.map((i) => ({
        name: i.name,
        color: i.color,
        size: i.size,
        qty: i.quantity,
        price: i.price,
      })),
      total: placedOrder.total,
      customerName: placedOrder.name,
      couponCode: placedOrder.couponCode || undefined,
    });
    const link = whatsappLink(
      BRAND.whatsapp,
      `${msg}\n\n*Order No:* ${placedOrder.orderNumber}\n*Email:* ${placedOrder.email}`
    );
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog
      open={checkoutOpen}
      onOpenChange={(o) => {
        if (!o) closeCheckout();
      }}
    >
      <DialogContent
        className="max-w-5xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-2xl scrollbar-lux"
        showCloseButton={!placedOrder}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Complete your order in a few short steps
          </DialogDescription>
        </DialogHeader>

        {placedOrder ? (
          <SuccessScreen
            orderNumber={placedOrder.orderNumber}
            name={placedOrder.name}
            email={placedOrder.email}
            onContinue={handleContinueShopping}
            onWhatsApp={handleTrackWhatsApp}
          />
        ) : (
          <div className="flex flex-col">
            {/* Top brand strip */}
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 bg-gradient-to-r from-primary/5 via-transparent to-gold/5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="font-serif text-lg font-semibold tracking-wide">
                  ZARIYA <span className="text-gold">Checkout</span>
                </span>
              </div>
              <Badge variant="outline" className="gap-1 border-gold/40 text-gold">
                <Lock className="h-3 w-3" /> Secure
              </Badge>
            </div>

            {/* Stepper */}
            <Stepper currentStep={step} />

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-0">
              {/* Left — form steps */}
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {step === 1 && (
                      <StepDetails form={form} errors={errors} setField={setField} />
                    )}
                    {step === 2 && (
                      <StepShipping form={form} errors={errors} setField={setField} />
                    )}
                    {step === 3 && (
                      <StepPayment
                        form={form}
                        setField={setField}
                        total={total}
                      />
                    )}
                    {step === 4 && (
                      <StepReview
                        form={form}
                        items={items}
                        subtotal={subtotal}
                        discount={discount}
                        couponCode={couponCode}
                        shipping={shipping}
                        total={total}
                        errors={errors}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between gap-3 border-t border-border/60 pt-5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 1 || placing}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </Button>

                  {step < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={placing}
                      className="min-w-[140px] gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Continue <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={placing || items.length === 0}
                      className="min-w-[180px] gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {placing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Placing Order…
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" /> Place Order —{" "}
                          {formatPrice(total)}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Right — order summary */}
              <OrderSummary
                items={items}
                subtotal={subtotal}
                discount={discount}
                couponCode={couponCode}
                shipping={shipping}
                total={total}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stepper                                                                    */
/* -------------------------------------------------------------------------- */

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
      <div className="mx-auto flex max-w-2xl items-center">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isComplete = currentStep > s.id;
          const isActive = currentStep === s.id;
          const isLast = idx === STEPS.length - 1;
          return (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full border-2 transition-all duration-300",
                    isActive &&
                      "border-gold bg-gold text-primary shadow-md shadow-gold/30",
                    isComplete &&
                      "border-gold bg-primary text-gold",
                    !isActive &&
                      !isComplete &&
                      "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-5 w-5" strokeWidth={3} />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mx-2 mb-5 h-0.5 flex-1 rounded-full transition-all duration-500",
                    currentStep > s.id ? "bg-gold" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Field wrapper                                                              */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  error,
  required,
  children,
  hint,
}: {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground/80">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-[11px] font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}

const inputClass =
  "h-11 rounded-xl border-border bg-background/60 transition-all focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:border-gold";

/* -------------------------------------------------------------------------- */
/*  Step 1 — Details                                                           */
/* -------------------------------------------------------------------------- */

function StepDetails({
  form,
  errors,
  setField,
}: {
  form: FormState;
  errors: Record<string, string>;
  setField: (k: keyof FormState, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Customer Details
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Where shall we send your confirmation, {BRAND.name}?
        </p>
      </header>

      <div className="space-y-4">
        <Field label="Full Name" required error={errors.customerName}>
          <Input
            value={form.customerName}
            onChange={(e) => setField("customerName", e.target.value)}
            placeholder="e.g. Ayesha Khan"
            className={inputClass}
            autoComplete="name"
          />
        </Field>

        <Field label="Email Address" required error={errors.email}>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="you@email.com"
            className={inputClass}
            autoComplete="email"
          />
        </Field>

        <Field
          label="Phone Number"
          required
          error={errors.phone}
          hint="10-digit mobile number — used for delivery updates"
        >
          <div className="flex items-center rounded-xl border border-border bg-background/60 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/40 transition-all overflow-hidden">
            <span className="px-3 text-sm font-medium text-muted-foreground border-r border-border bg-muted/40">
              +91
            </span>
            <Input
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="98765 43210"
              className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-0"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
            />
          </div>
        </Field>
      </div>

      <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
        <p className="flex items-start gap-2 text-xs text-foreground/80">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          <span>
            Your details are kept strictly confidential. Each ZARIYA piece is
            assigned a personal concierge who will hand-curate your delivery
            experience.
          </span>
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 2 — Shipping                                                          */
/* -------------------------------------------------------------------------- */

function StepShipping({
  form,
  errors,
  setField,
}: {
  form: FormState;
  errors: Record<string, string>;
  setField: (k: keyof FormState, v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Shipping Address
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          White-glove delivery to your doorstep, complimentary worldwide.
        </p>
      </header>

      <div className="space-y-4">
        <Field label="Street Address" required error={errors.address}>
          <Textarea
            value={form.address}
            onChange={(e) => setField("address", e.target.value)}
            placeholder="House no, street, locality, landmark…"
            className="rounded-xl border-border bg-background/60 focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:border-gold min-h-[80px]"
            rows={2}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City" required error={errors.city}>
            <Input
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              placeholder="e.g. Srinagar"
              className={inputClass}
              autoComplete="address-level2"
            />
          </Field>
          <Field label="State" required error={errors.state}>
            <Input
              value={form.state}
              onChange={(e) => setField("state", e.target.value)}
              placeholder="e.g. Jammu & Kashmir"
              className={inputClass}
              autoComplete="address-level1"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Pincode"
            required
            error={errors.pincode}
            hint="6-digit Indian postal code"
          >
            <Input
              value={form.pincode}
              onChange={(e) => setField("pincode", e.target.value)}
              placeholder="190001"
              className={inputClass}
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
            />
          </Field>
          <Field label="Country" required error={errors.country}>
            <Input
              value={form.country}
              onChange={(e) => setField("country", e.target.value)}
              placeholder="India"
              className={inputClass}
              autoComplete="country-name"
            />
          </Field>
        </div>

        <Field
          label="Order Notes (optional)"
          error={errors.notes}
          hint="Delivery instructions, gift wrap, or special requests"
        >
          <Textarea
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="e.g. Please gift wrap in ivory paper with gold ribbon…"
            className="rounded-xl border-border bg-background/60 focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:border-gold min-h-[80px]"
            rows={3}
            maxLength={500}
          />
        </Field>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
        <Truck className="h-5 w-5 shrink-0 text-gold" />
        <div className="text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Complimentary White-Glove Delivery</p>
          <p>Insured shipping in 5–7 business days. Each piece arrives in a signature muslin pouch.</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 3 — Payment                                                            */
/* -------------------------------------------------------------------------- */

function StepPayment({
  form,
  setField,
  total,
}: {
  form: FormState;
  setField: (k: keyof FormState, v: string) => void;
  total: number;
}) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Payment Method
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose how you wish to pay. Both options are secure.
        </p>
      </header>

      <RadioGroup
        value={form.paymentMethod}
        onValueChange={(v) => setField("paymentMethod", v)}
        className="gap-3"
      >
        <PaymentCard
          value="COD"
          selected={form.paymentMethod === "COD"}
          title="Cash on Delivery"
          subtitle="Pay in cash to our white-glove courier upon receipt."
          badge="Recommended"
          description="Available across India. Inspected before payment."
        />
        <PaymentCard
          value="ONLINE"
          selected={form.paymentMethod === "ONLINE"}
          title="Online Payment"
          subtitle="UPI / Credit Card / Debit Card / Net Banking."
          badge="Ready soon"
          description="Secure encrypted gateway. Faster dispatch priority."
        />
      </RadioGroup>

      <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/5 to-transparent p-5">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <div className="space-y-1">
            <p className="font-serif text-base font-semibold text-foreground">
              Payment Summary
            </p>
            <p className="text-xs text-muted-foreground">
              {form.paymentMethod === "COD"
                ? `You will pay ${formatPrice(total)} in cash on delivery. Please keep exact change ready for our concierge.`
                : `You will be redirected to a secure payment gateway to complete payment of ${formatPrice(total)}. No card details are stored on our servers.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentCard({
  value,
  selected,
  title,
  subtitle,
  badge,
  description,
}: {
  value: string;
  selected: boolean;
  title: string;
  subtitle: string;
  badge?: string;
  description: string;
}) {
  return (
    <label
      htmlFor={`pay-${value}`}
      className={cn(
        "flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 transition-all duration-300",
        selected
          ? "border-gold bg-gold/5 shadow-md shadow-gold/10"
          : "border-border bg-background/60 hover:border-gold/40 hover:bg-gold/[0.02]"
      )}
    >
      <RadioGroupItem
        id={`pay-${value}`}
        value={value}
        className="mt-1 data-[state=checked]:border-gold"
      />
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-serif text-base font-semibold text-foreground">
            {title}
          </span>
          {badge && (
            <Badge
              variant="outline"
              className={cn(
                "border-gold/40 text-gold",
                value === "COD" && "bg-gold text-primary border-transparent"
              )}
            >
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-foreground/80">{subtitle}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 4 — Review                                                            */
/* -------------------------------------------------------------------------- */

function StepReview({
  form,
  items,
  subtotal,
  discount,
  couponCode,
  shipping,
  total,
  errors,
}: {
  form: FormState;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shipping: number;
  total: number;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Review &amp; Confirm
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A final look before we hand your piece to our artisans.
        </p>
      </header>

      {/* Items */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Your Pieces
        </h3>
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={`${it.productId}-${it.color}-${it.size}`}
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 p-3"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted/30">
                <img
                  src={it.image}
                  alt={it.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-serif text-sm font-semibold text-foreground">
                  {it.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {it.color}
                  {it.size && it.size !== "One Size" ? ` · Size ${it.size}` : ""}{" "}
                  · Qty {it.quantity}
                </p>
              </div>
              <p className="font-serif text-sm font-semibold text-foreground">
                {formatPrice(it.price * it.quantity)}
              </p>
            </div>
          ))}
          {items.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Your bag is empty.
            </div>
          )}
        </div>
      </section>

      {/* Totals */}
      <Separator />
      <div className="space-y-2 text-sm">
        <Row label="Subtotal" value={formatPrice(subtotal)} />
        {discount > 0 && (
          <Row
            label={
              <span className="text-emerald">
                Discount {couponCode && `· ${couponCode}`}
              </span>
            }
            value={`– ${formatPrice(discount)}`}
            valueClass="text-emerald"
          />
        )}
        <Row
          label="Shipping"
          value={
            shipping === 0 ? (
              <span className="text-emerald">Free</span>
            ) : (
              formatPrice(shipping)
            )
          }
        />
        <Separator className="my-2" />
        <div className="flex items-center justify-between pt-1">
          <span className="font-serif text-base font-semibold text-foreground">
            Total Payable
          </span>
          <span className="font-serif text-xl font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <Separator />

      {/* Customer summary */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryBlock title="Customer">
          <p className="font-medium text-foreground">{form.customerName}</p>
          <p className="text-muted-foreground">{form.email}</p>
          <p className="text-muted-foreground">+91 {form.phone}</p>
        </SummaryBlock>
        <SummaryBlock title="Shipping">
          <p className="text-foreground">{form.address}</p>
          <p className="text-muted-foreground">
            {form.city}, {form.state} {form.pincode}
          </p>
          <p className="text-muted-foreground">{form.country}</p>
        </SummaryBlock>
        <SummaryBlock title="Payment">
          <p className="text-foreground">
            {form.paymentMethod === "COD"
              ? "Cash on Delivery"
              : "Online Payment (UPI/Card)"}
          </p>
        </SummaryBlock>
        {form.notes && (
          <SummaryBlock title="Order Notes">
            <p className="text-foreground/80 text-xs leading-relaxed">
              {form.notes}
            </p>
          </SummaryBlock>
        )}
      </section>

      {errors.items && (
        <p className="text-sm font-medium text-destructive">{errors.items}</p>
      )}

      <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
        <p className="flex items-start gap-2 text-xs text-foreground/80">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          <span>
            By placing your order, you agree to our terms. Payment is processed
            securely. Your piece will be hand-prepared by our master artisans.
          </span>
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium text-foreground", valueClass)}>{value}</span>
    </div>
  );
}

function SummaryBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
        {title}
      </p>
      <div className="space-y-0.5 text-sm">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Order summary sidebar                                                      */
/* -------------------------------------------------------------------------- */

function OrderSummary({
  items,
  subtotal,
  discount,
  couponCode,
  shipping,
  total,
}: {
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shipping: number;
  total: number;
}) {
  return (
    <aside className="border-t lg:border-t-0 lg:border-l border-border/60 bg-muted/20 lg:bg-gradient-to-b lg:from-muted/20 lg:to-background/40">
      <div className="lg:sticky lg:top-0 p-6 lg:p-7 space-y-5">
        <header className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Order Summary
          </h3>
          <Badge variant="outline" className="border-gold/40 text-gold">
            {items.length} {items.length === 1 ? "piece" : "pieces"}
          </Badge>
        </header>

        {/* Items */}
        <div className="max-h-72 overflow-y-auto scrollbar-lux space-y-3 pr-1">
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-xs text-muted-foreground">
              Your bag is empty.
            </div>
          ) : (
            items.map((it) => (
              <div
                key={`${it.productId}-${it.color}-${it.size}`}
                className="flex gap-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted/40">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {it.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {it.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {it.color}
                    {it.size && it.size !== "One Size" ? ` · ${it.size}` : ""}
                  </p>
                </div>
                <p className="text-xs font-semibold text-foreground">
                  {formatPrice(it.price * it.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2 text-sm">
          <Row label="Subtotal" value={formatPrice(subtotal)} />
          {discount > 0 ? (
            <Row
              label={
                <span className="text-emerald">
                  Discount {couponCode && `· ${couponCode}`}
                </span>
              }
              value={`– ${formatPrice(discount)}`}
              valueClass="text-emerald"
            />
          ) : (
            <Row label="Discount" value="—" valueClass="text-muted-foreground" />
          )}
          <Row
            label="Shipping"
            value={
              <span className="text-emerald font-medium">
                Free — white-glove
              </span>
            }
          />
        </div>

        <Separator />

        <div className="flex items-end justify-between">
          <span className="font-serif text-sm font-semibold text-foreground">
            Total
          </span>
          <span className="font-serif text-2xl font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          {TRUST_BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.label}
                className="flex items-center gap-1.5 rounded-lg bg-background/60 p-2"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-gold" />
                <span className="text-[10px] font-medium text-foreground/70">
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Success screen                                                             */
/* -------------------------------------------------------------------------- */

function SuccessScreen({
  orderNumber,
  name,
  email,
  onContinue,
  onWhatsApp,
}: {
  orderNumber: string;
  name: string;
  email: string;
  onContinue: () => void;
  onWhatsApp: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center overflow-hidden"
    >
      {/* Decorative gold glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, hsl(38 51% 56% / 0.18), transparent 60%)",
        }}
      />

      <div className="relative space-y-6 max-w-lg">
        {/* Animated gold checkmark */}
        <div className="relative mx-auto mb-2 grid place-items-center">
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="text-gold"
            initial="hidden"
            animate="visible"
          >
            {/* Outer ring */}
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: { duration: 0.9, ease: "easeInOut" },
                },
              }}
            />
            {/* Inner subtle fill */}
            <motion.circle
              cx="60"
              cy="60"
              r="46"
              fill="currentColor"
              fillOpacity="0.08"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            />
            {/* Check mark */}
            <motion.path
              d="M40 62 L54 76 L82 46"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  transition: { delay: 0.7, duration: 0.5, ease: "easeOut" },
                },
              }}
            />
          </motion.svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="space-y-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Order Confirmed
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
            Thank you, {name.split(" ")[0]}!
          </h2>
          <p className="text-sm text-muted-foreground">
            A confirmation has been sent to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="mx-auto inline-flex flex-col items-center gap-1 rounded-2xl border border-gold/30 bg-gold/[0.04] px-8 py-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Order Number
            </span>
            <span className="font-serif text-xl font-bold text-primary tracking-wider">
              {orderNumber}
            </span>
          </div>

          <p className="mx-auto max-w-md font-serif text-base italic text-foreground/80">
            “Your piece is being hand-prepared by our artisans — slow, careful
            stitches, just for you.”
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2"
        >
          <Button
            onClick={onContinue}
            variant="default"
            className="h-12 min-w-[180px] rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={onWhatsApp}
            variant="outline"
            className="h-12 min-w-[180px] rounded-full border-emerald/40 text-emerald hover:bg-emerald/5 gap-2"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Track on WhatsApp
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.5 }}
          className="pt-4 text-[11px] text-muted-foreground"
        >
          Need help? Reach our concierge at{" "}
          <a
            href={`mailto:${BRAND.email}`}
            className="font-medium text-gold underline-offset-2 hover:underline"
          >
            {BRAND.email}
          </a>
        </motion.p>
      </div>
    </motion.div>
  );
}

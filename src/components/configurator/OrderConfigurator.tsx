"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { requestSchema, type RequestInput } from "@/lib/validations";
import { cn, formatPrice } from "@/lib/utils";

// ─── Pricing constants ────────────────────────────────────────────────────────

const BASE_PRICE = 16_000;
const HERITAGE_MATERIALS = new Set(["oak"]);
const SIGNATURE_MATERIALS = new Set(["walnut", "elm", "pear", "cherry"]);

function calculatePrice(
  material: string,
  finish: string,
  columnProfile: string,
  platformThickness: string,
  selectedOptions: string[],
): number {
  let price = BASE_PRICE;

  if (HERITAGE_MATERIALS.has(material)) price += 2_000;
  if (SIGNATURE_MATERIALS.has(material)) price += 4_000;

  if (finish === "powder-matte") price += 1_000;

  if (columnProfile === "120x80x5" || columnProfile === "120x120x5")
    price += 1_500;
  if (columnProfile === "round-57") price += 2_500;

  if (platformThickness === "6mm") price += 500;
  if (platformThickness === "8mm") price += 1_000;

  if (selectedOptions.includes("cable-channel")) price += 2_000;
  if (selectedOptions.includes("footprint-base")) price += 2_000;
  if (selectedOptions.includes("height-750")) price += 1_000;
  if (selectedOptions.includes("edge-rounding")) price += 500;

  return price;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const PRODUCT_TYPES = [
  {
    value: "acoustic-stand",
    label: "Акустические стойки",
    desc: "Для полочной акустики",
  },
  { value: "hifi-stand", label: "Стойка для HI-FI", desc: "Для аппаратуры" },
  {
    value: "acoustic-panel",
    label: "Акустическая панель",
    desc: "Для комнаты",
  },
  { value: "diffuser", label: "Диффузор", desc: "QRD и другие" },
  { value: "accessory", label: "Аксессуар", desc: "Шипы, прокладки и др." },
];

const MATERIALS = [
  { value: "birch",       label: "Берёза",       tier: null },
  { value: "beech",       label: "Бук",           tier: null },
  { value: "ash",         label: "Ясень",         tier: null },
  { value: "oak",         label: "Дуб",           tier: "Heritage" },
  { value: "elm",         label: "Карагач",       tier: "Signature" },
  { value: "pear",        label: "Груша",         tier: "Signature" },
  { value: "cherry",      label: "Вишня",         tier: "Signature" },
  { value: "walnut",      label: "Орех",          tier: "Signature" },
];

const FINISHES = [
  { value: "powder-matte", label: "Порошковая матовая", surcharge: 1_000 },
  { value: "powder-moire", label: "Порошковая муар" },
];

const BASE_FINISHES = [
  { value: "oil-wax", label: "Масло + воск" },
  { value: "wax", label: "Воск" },
  { value: "oil-wax-combo", label: "Масло + воск и Воск" },
];

const METAL_COLORS = [
  { value: "black",      label: "Чёрный",   hex: "#1c1c1c" },
  { value: "anthracite", label: "Антрацит", hex: "#4a4a52" },
  { value: "silver",     label: "Серебро",  hex: "#a8a9ad" },
  { value: "white",      label: "Белый",    hex: "#f0f0f0" },
  { value: "bronze",     label: "Бронза",   hex: "#b5803a" },
];

const COLUMN_PROFILES = [
  { value: "100x100x3", label: "100×100 мм, стенка 3 мм", desc: "Стандарт" },
  { value: "120x80x5", label: "120×80 мм, стенка 5 мм", desc: "Усиленный" },
  {
    value: "120x120x5",
    label: "120×120 мм, стенка 5 мм",
    desc: "Максимальный",
  },
  { value: "round-57", label: "Круглые Ø57 мм", desc: "Круглая колонна" },
];

const PLATFORM_THICKNESSES = [
  { value: "4mm", label: "4 мм", desc: "Стандарт" },
  { value: "6mm", label: "6 мм", desc: "Усиленная" },
  { value: "8mm", label: "8 мм", desc: "Максимальная" },
];

const ADDITIONAL_OPTIONS = [
  {
    value: "cable-channel",
    label: "Внутренний кабель-канал",
    desc: "Провода спрятаны внутри колонны, выход у основания",
  },
  {
    value: "footprint-base",
    label: "Основание и платформа по форме акустики",
    desc: "Повторяет футпринт колонок — закруглённые или фигурные боковины",
  },
  {
    value: "height-750",
    label: "Высота >750 мм",
    desc: "Нестандартная высота колонны",
  },
  {
    value: "edge-rounding",
    label: "Скругление рёбер (радиусом скругления на выбор)",
    desc: "",
  },
];

const STEPS = [
  "Тип изделия",
  "Размеры",
  "Материал",
  "Отделка",
  "Опции",
  "Контакты",
];

// ─── Shared class helpers ─────────────────────────────────────────────────────

const selectedBorder = "border border-accent bg-accent/12";
const idleBorder = "border-border hover:border-(--accent) hover:bg-(--accent)/5 hover:-translate-y-0.5 hover:shadow-sm";
const radioActive = "border-accent bg-accent";
const radioIdle = "border-border";
const checkActive = "bg-accent border-accent text-accent-foreground";
const checkIdle = "border-border";

// ─── Component ────────────────────────────────────────────────────────────────

interface OrderConfiguratorProps {
  user?: { name?: string | null; email?: string | null; phone?: string | null }
}

export function OrderConfigurator({ user }: OrderConfiguratorProps) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [productType, setProductType] = useState("");
  const [material, setMaterial] = useState("");
  const [finish, setFinish] = useState("");
  const [baseFinish, setBaseFinish] = useState("");
  const [metalColor, setMetalColor] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [columnProfile, setColumnProfile] = useState("100x100x3");
  const [platformThickness, setPlatformThickness] = useState("4mm");
  const [priceRevealed, setPriceRevealed] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  useEffect(() => {
    setValue("productType", productType);
  }, [productType, setValue]);

  const [dimW, dimD, platW, platD, baseW, baseD, msg] = useWatch({
    control,
    name: [
      "dimensions.width", "dimensions.depth",
      "dimensionsPlatform.width", "dimensionsPlatform.depth",
      "dimensionsBase.width", "dimensionsBase.depth",
      "message",
    ],
  });

  const toggleOption = (opt: string) => {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt],
    );
    setPriceRevealed(false);
  };

  const filled = (v: string | undefined) => !!v?.trim();

  const canNext = () => {
    if (step === 0) return productType === "acoustic-stand";
    if (step === 1) {
      if (productType === "acoustic-stand") {
        const allDims = [platW, platD, baseW, baseD].every(filled);
        return allDims || filled(msg);
      }
      return [dimW, dimD, msg].some(filled);
    }
    if (step === 2) return !!material;
    if (step === 3) return !!finish && !!baseFinish;
    return true;
  };

  const handleCalculatePrice = () => {
    setCalculatedPrice(
      calculatePrice(
        material,
        finish,
        columnProfile,
        platformThickness,
        selectedOptions,
      ),
    );
    setPriceRevealed(true);
  };

  const onSubmit = async (data: RequestInput) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          productType,
          material,
          color: metalColor || undefined,
          finish,
          baseFinish,
          options: [
            ...selectedOptions,
            `column:${columnProfile}`,
            `platform:${platformThickness}`,
          ],
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setSubmitted(true);
    } catch {
      setSubmitError("Не удалось отправить заявку. Попробуйте ещё раз.");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(0);
    setProductType("");
    setMaterial("");
    setFinish("");
    setBaseFinish("");
    setMetalColor("");
    setSelectedOptions([]);
    setColumnProfile("100x100x3");
    setPlatformThickness("4mm");
    setPriceRevealed(false);
    setCalculatedPrice(0);
  };

  // ─── Success screen ──────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </motion.div>
        <h2 className="text-3xl font-bold">Заявка отправлена!</h2>
        <p className="text-muted-foreground max-w-sm">
          Свяжемся с вами в течение суток. Обсудим детали и подтвердим заказ.
        </p>
        <Button onClick={handleReset}>Оформить ещё один</Button>
      </div>
    );
  }

  // ─── Wizard ──────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <nav aria-label="Шаги оформления заказа">
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => i < step && setStep(i)}
                aria-label={`Шаг ${i + 1}: ${s}`}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "shrink-0 h-8 w-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all",
                  i < step
                    ? "bg-accent text-accent-foreground cursor-pointer"
                    : i === step
                      ? "border-2 border-accent text-accent"
                      : "bg-muted text-muted-foreground cursor-default",
                )}
              >
                {i < step ? "✓" : i + 1}
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    i < step ? "bg-accent" : "bg-border",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 0: Product type */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Выберите тип изделия</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {PRODUCT_TYPES.map((type) => {
                  const available = type.value === "acoustic-stand"
                  return (
                    <button
                      key={type.value}
                      onClick={() => setProductType(type.value)}
                      aria-pressed={productType === type.value}
                      className={cn(
                        "relative flex flex-col gap-1 p-4 rounded-xl border text-left transition-all",
                        available ? "cursor-pointer" : "cursor-default opacity-60",
                        productType === type.value
                          ? selectedBorder
                          : idleBorder,
                      )}
                    >
                      {!available && (
                        <span className="absolute top-2.5 right-2.5">
                          <Badge variant="outline" className="text-[0.6rem] px-1.5 py-0 leading-4 border-muted-foreground/40 text-muted-foreground">
                            Скоро
                          </Badge>
                        </span>
                      )}
                      <span
                        className={cn(
                          "font-semibold text-sm transition-colors",
                          productType === type.value && "text-accent",
                        )}
                      >
                        {type.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {type.desc}
                      </span>
                    </button>
                  )
                })}
              </div>

              {productType && productType !== "acoustic-stand" && (
                <div className="rounded-xl border border-border bg-muted/40 px-5 py-4">
                  <p className="text-sm font-semibold mb-1">Раздел в разработке</p>
                  <p className="text-sm text-muted-foreground">
                    Конфигуратор для этого типа изделия скоро будет готов. Пока вы можете{" "}
                    <a href="mailto:info@standmuse.ru" className="text-accent hover:underline">написать нам напрямую</a>{" "}
                    — обсудим детали и оформим заявку вручную.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Dimensions */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">
                {productType === "acoustic-stand"
                  ? "Укажите необходимые размеры"
                  : "Укажите размеры"}
              </h2>

              {productType === "acoustic-stand" ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Укажите габариты платформы и основания. Если не знаете точно
                    — напишите примерные или модель акустики.
                  </p>

                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold">
                      Платформа для акустики
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Ширина, мм"
                        placeholder="220"
                        {...register("dimensionsPlatform.width")}
                      />
                      <Input
                        label="Глубина, мм"
                        placeholder="350"
                        {...register("dimensionsPlatform.depth")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold">Основание стойки</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Ширина, мм"
                        placeholder="200"
                        {...register("dimensionsBase.width")}
                      />
                      <Input
                        label="Глубина, мм"
                        placeholder="250"
                        {...register("dimensionsBase.depth")}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Если не знаете точно — укажите примерные или напишите модель
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Ширина, мм"
                      placeholder="200"
                      {...register("dimensions.width")}
                    />
                    <Input
                      label="Глубина, мм"
                      placeholder="250"
                      {...register("dimensions.depth")}
                    />
                  </div>
                </>
              )}

              <Textarea
                label="Модель акустики или пожелания"
                placeholder="Wharfedale Diamond 12.2, нужны стойки 60 см высотой..."
                rows={3}
                {...register("message")}
              />
            </div>
          )}

          {/* Step 2: Material */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Выберите породу дерева</h2>
              <div className="grid grid-cols-3 gap-3">
                {MATERIALS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => {
                      setMaterial(m.value);
                      setPriceRevealed(false);
                    }}
                    aria-pressed={material === m.value}
                    className={cn(
                      "relative p-3 rounded-xl border text-sm font-medium text-left transition-all cursor-pointer",
                      material === m.value
                        ? `${selectedBorder} text-accent`
                        : idleBorder,
                    )}
                  >
                    {m.label}
                    {m.tier && (
                      <span className="absolute top-1.5 right-1.5">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[0.6rem] px-1.5 py-0 leading-4",
                            m.tier === "Heritage"
                              ? "border-muted-foreground/40 text-muted-foreground"
                              : "border-(--accent)/40 text-accent",
                          )}
                        >
                          {m.tier}
                        </Badge>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Color + Finish */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">Цвет и отделка</h2>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold">Цвет металла</p>
                <div className="flex gap-3 flex-wrap">
                  {METAL_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setMetalColor(c.value)}
                      aria-pressed={metalColor === c.value}
                      title={c.label}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer",
                        metalColor === c.value ? selectedBorder : idleBorder,
                      )}
                    >
                      <span
                        className="h-8 w-8 rounded-full border border-border/40 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className={metalColor === c.value ? "text-accent" : ""}>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold">Тип покрытия колонны и платформы</p>
                <div className="grid grid-cols-2 gap-3">
                  {FINISHES.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => { setFinish(f.value); setPriceRevealed(false); }}
                      aria-pressed={finish === f.value}
                      className={cn(
                        "p-4 rounded-xl border text-sm font-medium text-left transition-all cursor-pointer",
                        finish === f.value
                          ? `${selectedBorder} text-accent`
                          : idleBorder,
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold">
                  Отделка основания стойки{" "}
                  <span className="font-normal text-muted-foreground">(все материалы Borma, если не указано иное)</span>
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {BASE_FINISHES.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setBaseFinish(f.value)}
                      aria-pressed={baseFinish === f.value}
                      className={cn(
                        "p-4 rounded-xl border text-sm font-medium text-left transition-all cursor-pointer",
                        baseFinish === f.value
                          ? `${selectedBorder} text-accent`
                          : idleBorder,
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Configuration + Options */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold">Конфигурация и опции</h2>

              {/* Column profile */}
              <fieldset className="flex flex-col gap-3">
                <legend className="text-sm font-semibold">
                  Профиль колонны
                </legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {COLUMN_PROFILES.map((cp) => (
                    <button
                      key={cp.value}
                      onClick={() => {
                        setColumnProfile(cp.value);
                        setPriceRevealed(false);
                      }}
                      aria-pressed={columnProfile === cp.value}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border text-sm text-left transition-all cursor-pointer",
                        columnProfile === cp.value
                          ? selectedBorder
                          : idleBorder,
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 transition-colors",
                          columnProfile === cp.value ? radioActive : radioIdle,
                        )}
                        aria-hidden="true"
                      />
                      <span className="flex flex-col">
                        <span
                          className={cn(
                            "font-medium transition-colors",
                            columnProfile === cp.value && "text-accent",
                          )}
                        >
                          {cp.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {cp.desc}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Platform thickness */}
              <fieldset className="flex flex-col gap-3">
                <legend className="text-sm font-semibold">
                  Толщина платформы
                </legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {PLATFORM_THICKNESSES.map((pt) => (
                    <button
                      key={pt.value}
                      onClick={() => {
                        setPlatformThickness(pt.value);
                        setPriceRevealed(false);
                      }}
                      aria-pressed={platformThickness === pt.value}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border text-sm text-left transition-all cursor-pointer",
                        platformThickness === pt.value
                          ? selectedBorder
                          : idleBorder,
                      )}
                    >
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full border-2 shrink-0 transition-colors",
                          platformThickness === pt.value
                            ? radioActive
                            : radioIdle,
                        )}
                        aria-hidden="true"
                      />
                      <span>
                        <span
                          className={cn(
                            "font-medium transition-colors",
                            platformThickness === pt.value && "text-accent",
                          )}
                        >
                          {pt.label}
                        </span>
                        {pt.desc && (
                          <span className="text-xs text-muted-foreground ml-1.5">
                            — {pt.desc}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Additional options */}
              <fieldset className="flex flex-col gap-3">
                <legend className="text-sm font-semibold">
                  Дополнительные опции
                </legend>
                <div className="flex flex-col gap-2">
                  {ADDITIONAL_OPTIONS.filter(
                    (opt) =>
                      productType !== "acoustic-stand" ||
                      (opt.value !== "wall-mount" && opt.value !== "engraving"),
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => toggleOption(opt.value)}
                      aria-pressed={selectedOptions.includes(opt.value)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border text-sm text-left transition-all cursor-pointer",
                        selectedOptions.includes(opt.value)
                          ? selectedBorder
                          : idleBorder,
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                          selectedOptions.includes(opt.value)
                            ? checkActive
                            : checkIdle,
                        )}
                        aria-hidden="true"
                      >
                        {selectedOptions.includes(opt.value) && (
                          <span className="text-xs leading-none">✓</span>
                        )}
                      </span>
                      <span className="flex flex-col">
                        <span
                          className={cn(
                            "font-medium transition-colors",
                            selectedOptions.includes(opt.value) &&
                              "text-accent",
                          )}
                        >
                          {opt.label}
                        </span>
                        {opt.desc && (
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {opt.desc}
                          </span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Animated price reveal */}
              <AnimatePresence>
                {priceRevealed && (
                  <motion.div
                    key="price-block"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl border border-(--accent)/30 bg-accent/5 px-6 py-5"
                    aria-live="polite"
                    aria-label="Рассчитанная стоимость"
                  >
                    <p className="text-sm text-muted-foreground mb-1">
                      Стоимость пары стоек
                    </p>
                    <p className="text-4xl font-bold tabular-nums">
                      {formatPrice(calculatedPrice)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Срок изготовления: 14 дней
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Step 5: Contact */}
          {step === 5 && (
            <form onSubmit={handleSubmit(onSubmit)} id="configurator-form">
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold">Контактные данные</h2>
                {user && (
                  <p className="text-xs text-muted-foreground -mt-2">
                    Данные подставлены из вашего профиля — проверьте и при необходимости исправьте.
                  </p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Имя"
                    placeholder="Александр"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="alex@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <Input
                  label="Телефон (необязательно)"
                  type="tel"
                  placeholder="+7 900 000 00 00"
                  {...register("phone")}
                />
                <p className="text-xs text-muted-foreground">
                  Ответим в течение суток. Обсудим детали и подтвердим заказ.
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-end gap-3 mt-4 pt-4">
        {submitError && (
          <p className="text-sm text-destructive mr-auto">{submitError}</p>
        )}
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          aria-label="Предыдущий шаг"
        >
          Назад
        </Button>

        {step < STEPS.length - 1 ? (
          step === 4 ? (
            priceRevealed ? (
              <Button onClick={() => setStep((s) => s + 1)}>
                Оформить заказ
              </Button>
            ) : (
              <Button onClick={handleCalculatePrice}>
                Рассчитать стоимость
              </Button>
            )
          ) : (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
              Далее
            </Button>
          )
        ) : (
          <Button type="submit" form="configurator-form" loading={isSubmitting}>
            Отправить заявку
          </Button>
        )}
      </div>
    </div>
  );
}

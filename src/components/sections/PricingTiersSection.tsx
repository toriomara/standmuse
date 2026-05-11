"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { cn, formatPrice } from "@/lib/utils";

interface Tier {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  description: string;
  features: string[];
  forWhom: string;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    id: "standard",
    title: "Стандарт",
    subtitle: "Классика, проверенная десятками заказов",
    price: 16000,
    description:
      "Надёжная конструкция с лаконичной геометрией. Подходит для большинства полочной акустики начального и среднего сегмента.",
    features: [
      "Основание из массива бука/ясеня/берёзы, 40 мм",
      "Колонна 100×100 мм, стенка 3 мм",
      "Верхняя платформа 4 мм",
      "Покрытие: масло воск Borma (естественная текстура)",
      "Покраска металла: чёрный матовый",
      "Прямоугольное основание и платформа",
      "Шипы М6 с подпятниками в комплекте",
      "Шпилька М8, стягивающая конструкцию",
      "Возможность засыпки кварцевым песком",
    ],
    forWhom:
      "Первая аудиосистема, обновление штатных стоек, лаконичный интерьер.",
  },
  {
    id: "standard-plus",
    title: "Стандарт+",
    subtitle: "Один шаг к индивидуальности",
    price: 19000,
    description:
      "Всё из тарифа «Стандарт» плюс одна премиальная опция на выбор. Самый частый формат заказа — баланс цены и характера.",
    features: [
      "Всё из уровня «Стандарт»",
      "Основание из массива дуба, 40 мм",
      "Внутренний кабель-канал — провода скрыты в колонне",
      "ИЛИ усиленный профиль 120×80×5 или 120×120×5 мм",
      "ИЛИ тонировка основания (венге, коньяк, антик)",
      "ИЛИ основание по форме акустики (футпринт)",
    ],
    forWhom:
      "Серьёзный сетап, желание подчеркнуть характер акустики, интерьер с собственным стилем.",
    featured: true,
  },
  {
    id: "premium",
    title: "Премиум",
    subtitle: "Без компромиссов",
    price: 23000,
    description:
      "Премиальные породы дерева, индивидуальная геометрия и весь набор технических опций. Изделие, которое становится самостоятельным элементом интерьера.",
    features: [
      "Основание: орех/груша/вишня/карагач",
      "Внутренний кабель-канал",
      "Основание по форме акустики (футпринт)",
      "Тонировка или индивидуальное цветовое решение",
      "Усиленный профиль 5 мм или круглые колонны Ø57",
      "Платформа 4–6 мм по выбору",
      "Скругление рёбер по согласованному радиусу",
      "Расширенная консультация по материалу и геометрии",
      "Пробные выкрасы перед финишной обработкой",
    ],
    forWhom:
      "Высококлассная акустика, аудиофильский сетап, интерьер с дизайнерским подходом.",
  },
];

const INCLUDED_FEATURES = [
  "Индивидуальная спецификация перед стартом",
  "Фотоотчёт на этапах изготовления",
  "Надёжная упаковка для транспортировки",
  "Шипы М6 с подпятниками в комплекте",
  "Срок изготовления — 14 дней",
  "Доставка по России почтой или СДЭК",
];

export function PricingTiersSection() {
  return (
    <section
      aria-labelledby="tiers-heading"
      className="py-20 md:py-28 bg-muted/40"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-accent mb-3 block">
              Уровни исполнения
            </span>
            <h2
              id="tiers-heading"
              className="text-3xl lg:text-4xl font-bold tracking-tight mb-4"
            >
              Три уровня исполнения
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Пакеты — ориентир по цене и комплектации. Точную конфигурацию под
              ваши размеры и задачи вы собираете в конфигураторе ниже.
            </p>
          </motion.div>
        </div>

        {/* Tier grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier, i) => (
            <motion.article
              key={tier.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="h-full"
            >
              <Card
                className={cn(
                  "flex flex-col h-full transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg hover:border-accent",
                )}
              >
                <CardHeader className="pb-4 gap-3">
                  {tier.featured && (
                    <div>
                      <Badge variant="accent">Популярный выбор</Badge>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold leading-tight">
                      {tier.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tier.subtitle}
                    </p>
                  </div>
                  {/* Price anchor */}
                  <div className="pt-1">
                    <span className="text-4xl font-bold tabular-nums">
                      {formatPrice(tier.price)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      / пара
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col gap-5 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tier.description}
                  </p>

                  <ul
                    role="list"
                    className="flex flex-col gap-2"
                    aria-label={`Что входит в ${tier.title}`}
                  >
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check
                          className="h-4 w-4 text-accent shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* "Для кого" block */}
                  <div className="mt-auto rounded-xl bg-muted px-4 py-3">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Для кого
                    </p>
                    <p className="text-sm leading-relaxed">{tier.forWhom}</p>
                  </div>
                </CardContent>

                <CardFooter className="pt-4">
                  <Button
                    variant={tier.featured ? "default" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <a
                      href="#configurator"
                      aria-label={`Выбрать уровень ${tier.title}`}
                    >
                      Перейти к конфигуратору
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.article>
          ))}
        </div>

        {/* "Всё включено" block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-14 rounded-2xl border border-border bg-card px-6 sm:px-10 py-8 sm:py-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
                Входит в любой уровень
              </p>
              <ul
                role="list"
                className="grid sm:grid-cols-2 gap-x-8 gap-y-2"
                aria-label="Общие включённые позиции"
              >
                {INCLUDED_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      className="h-4 w-4 text-accent shrink-0"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0">
              <Button size="lg" asChild>
                <a href="#configurator">Перейти к конфигуратору</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

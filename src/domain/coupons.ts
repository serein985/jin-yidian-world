export type CouponOfferId =
  | "merch"
  | "dining"
  | "experience"
  | "photo"
  | "drink";

export interface CouponOffer {
  id: CouponOfferId;
  title: string;
  summary: string;
  terms: string;
  accent: string;
}

export const COUPON_OFFERS: CouponOffer[] = [
  {
    id: "merch",
    title: "动物周边 9 折券",
    summary: "园区动物主题商品店通用",
    terms: "单笔消费满 1 件可用，不与其他折扣同享。",
    accent: "merch",
  },
  {
    id: "dining",
    title: "园区餐饮满 50 减 10 元",
    summary: "林间餐车及合作餐饮可用",
    terms: "单笔实付满 50 元可用，不与其他满减同享。",
    accent: "dining",
  },
  {
    id: "experience",
    title: "互动体验减 10 元",
    summary: "指定动物互动体验项目可用",
    terms: "预约指定互动项目时抵扣，不与其他体验券同享。",
    accent: "experience",
  },
  {
    id: "photo",
    title: "纪念照片减 8 元",
    summary: "园区纪念影像服务可用",
    terms: "冲印或数字纪念照套餐满 20 元可用。",
    accent: "photo",
  },
  {
    id: "drink",
    title: "园区饮品买一赠一",
    summary: "指定饮品档口可用",
    terms: "同款饮品限赠一杯，优惠仅限单次订单。",
    accent: "drink",
  },
];

export const COUPONS_BY_ID = Object.fromEntries(
  COUPON_OFFERS.map((offer) => [offer.id, offer]),
) as Record<CouponOfferId, CouponOffer>;

export function getCouponOffer(offerId: string): CouponOffer {
  return (
    COUPONS_BY_ID[offerId as CouponOfferId] ?? COUPONS_BY_ID.merch
  );
}

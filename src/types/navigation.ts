export type RootStackParamList = {
  Onboarding: undefined;
  CustomerLogin: undefined;
  PartnerLogin: undefined;
  PartnerRegister: undefined;
  OTP: { email: string; type: 'customer' | 'partner' };
  CustomerHome: undefined;
  PartnerHome: undefined;
  MapPicker: { onSelect: (address: string) => void };
  Topup: undefined;
  Riwayat: { initialTab?: string } | undefined;
  NearbyLaundry: undefined;
  PartnerList: { service: { id: string; name: string; icon: string; color: string } };
  PartnerDetail: { partner: any; service: any };
  ServiceOrder: {
    service: {
      id: string;
      name: string;
      icon: string;
      color: string;
      price?: number;
      packages?: { id: string; name: string; time: string; price: number }[];
    };
    partner: any
  };
  Payment: {
    totalAmount: number;
    serviceInfo: any;
    partnerInfo: any;
    estimatedPoints: number;
  };
  PaymentSuccess: { order: any };
  OrderTracking: { orderId: string };
  InboxDetail: {
    id: string;
    type: string;
    title: string;
    message: string;
    time: string;
    icon: string;
    iconColor: string;
  };
  EditProfile: undefined;
  AlamatSaya: undefined;
  VoucherSaya: undefined;
  PusatBantuan: { type: 'customer' | 'partner' };
  SyaratKetentuan: undefined;
  KebijakanPrivasi: undefined;
  PromoSpesial: undefined;
  EditProfilPartner: undefined;
  PengaturanToko: undefined;
  KelolaLayanan: undefined;
  UlasanPelanggan: undefined;
  TarikSaldo: undefined;
  RiwayatTarikSaldo: undefined;
  WaitingWithdrawal: { amount: number };
  DetailRiwayatTarikSaldo: { withdrawal: any };
  PartnerOrderList: undefined;
  PartnerOrderDetail: { order: any };
};

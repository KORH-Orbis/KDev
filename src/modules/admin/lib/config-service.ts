import { prisma } from "../../core/lib/prisma";
import { config } from "../../core/lib/config";

export type ConfigUpdate = {
  appName?: string;
  appDescription?: string;
  contactEmail?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  guaranteeDays?: number;
  trackingPrefix?: string;
  sparePartMargin?: number;
};

export async function getConfig() {
  let appConfig = await prisma.appConfig.findFirst();
  if (!appConfig) {
    appConfig = await prisma.appConfig.create({
      data: {
        id: 1,
        appName: config.appName,
        appDescription: config.appDescription,
        contactEmail: config.contactEmail,
        phone: config.phone,
        whatsapp: config.whatsapp,
        address: config.address,
        guaranteeDays: config.guaranteeDays,
        trackingPrefix: config.trackingPrefix,
        sparePartMargin: 1.5,
      },
    });
  }
  return appConfig;
}

export async function updateConfig(data: ConfigUpdate) {
  await getConfig();
  return prisma.appConfig.update({
    where: { id: 1 },
    data,
  });
}

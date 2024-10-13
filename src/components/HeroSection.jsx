import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import React from "react";
import bgImg from "../assets/bg2.webp";

export default function HeroSection({ title, href }) {
  return (
    <div className="relative h-[40vh]">
      <img src={bgImg} className="absolute -z-20 h-full w-full object-cover" />
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        <Breadcrumbs size="lg">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href={href}>{title}</BreadcrumbItem>
        </Breadcrumbs>
      </div>
    </div>
  );
}

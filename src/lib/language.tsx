"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "bn";

interface FeatureItem {
  title: string;
  description: string;
  image?: string;
}

type TranslationValue = string | FeatureItem[];
type Translations = Record<string, Record<string, TranslationValue>>;

const translations: Translations = {
  en: {
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.pricing": "Pricing",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.login": "Log in",
    "language.english": "English",
    "language.bangla": "বাংলা",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "hero.title": "Build Better Real Estate Business",
    "hero.description":
      "Streamline property management, automate workflows, and grow your portfolio with RealBiz's intelligent platform.",
    "hero.cta": "Get Started Free",
    "hero.dashboardAlt": "RealBiz Dashboard Preview",
    "footer.copyright":
      "© {year} RealBiz. Built for operators, not just owners.",
    "footer.tagline": "RealBiz",
    "features.title": "Everything You Need in One Platform",
    "features.subtitle": "Our Features",
    "features.description":
      "Powerful tools designed to help you manage every part of your business from one simple platform.",
    "features.viewAll": "View All Features",
    "features.view": "View",
    "features.uptime": "99.9% Uptime",
    "features.support": "24/7 Support",
    "features.noCard": "No Credit Card",
    "features.list": [
      {
        title: "Property Management",
        description:
          "Manage properties, units, availability, pricing and property information from one place.",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Property Listings",
        description:
          "Create and manage property listings with images, details, locations and pricing.",
        image:
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Leads & CRM",
        description:
          "Track potential buyers, manage leads and build strong customer relationships.",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Sales & Booking",
        description:
          "Manage property sales, bookings, customers, payments and booking status easily.",
        image:
          "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Project Management",
        description:
          "Monitor real estate projects, construction progress, tasks and project activities.",
        image:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Accounts & Finance",
        description:
          "Manage payments, expenses, invoices and financial transactions for your business.",
        image:
          "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
      },
    ],
    "services.title": "Professional real estate services for every need.",
    "services.subtitle": "Real Estate Services",
    "services.description":
      "We provide premium real estate solutions with a wide range of professional services designed to make your property journey simple, secure, and successful.",
    "services.feature1": "Customized Property Marketing",
    "services.feature2": "Property Valuation Services",
    "services.feature3": "Market Research and Analysis",
    "services.explore": "Explore More",
    "services.imageAlt1": "Modern luxury real estate property",
    "services.imageAlt2": "Luxury residential building",

    // Pricing Section
    "pricing.badge": "Pricing Plans",
    "pricing.subtitle": "Pricing",
    "pricing.title": "Simple pricing that scales with you",
    "pricing.description":
      "Start free, upgrade when your team grows. No hidden fees, no long-term contracts.",
    "pricing.monthly": "Monthly",
    "pricing.yearly": "Yearly",
    "pricing.saveBadge": "Save 20%",
    "pricing.popular": "Most Popular",
    "pricing.perMonth": "/month",
    "pricing.perYear": "/year",
    "pricing.billedMonthly": "Billed monthly",
    "pricing.custom": "Custom",
    "pricing.cta": "View full pricing",
    "pricing.faqTitle": "Frequently Asked Questions",

    "pricing.starter.name": "Starter",
    "pricing.starter.description":
      "Essential tools for small teams or solo agents.",
    "pricing.starter.cta": "Get Started",
    "pricing.starter.f1": "Up to 50 active listings",
    "pricing.starter.f2": "Basic Lead CRM",
    "pricing.starter.f3": "2 team member seats",
    "pricing.starter.f4": "Email support",

    "pricing.growth.name": "Growth",
    "pricing.growth.description":
      "Ideal for expanding teams needing workflow automation.",
    "pricing.growth.cta": "Start 14-Day Free Trial",
    "pricing.growth.note": "$65/mo billed yearly",
    "pricing.growth.f1": "Unlimited listings",
    "pricing.growth.f2": "Advanced Lead CRM & Sales Pipeline",
    "pricing.growth.f3": "10 team member seats",
    "pricing.growth.f4": "Multi-branch management",
    "pricing.growth.f5": "Priority 24/7 support",

    "pricing.enterprise.name": "Enterprise",
    "pricing.enterprise.description":
      "Tailored features & support for large agencies.",
    "pricing.enterprise.cta": "Contact Sales",
    "pricing.enterprise.note": "Tailored for your business size",
    "pricing.enterprise.f1": "Everything in Growth",
    "pricing.enterprise.f2": "Unlimited team seats",
    "pricing.enterprise.f3": "Custom API & CRM integrations",
    "pricing.enterprise.f4": "Dedicated Account Manager",
    "pricing.enterprise.f5": "Custom SLA & Uptime Guarantee",

    "pricing.faq1.q": "Can I switch plans later?",
    "pricing.faq1.a":
      "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your workspace settings.",
    "pricing.faq2.q": "Is there a free trial available?",
    "pricing.faq2.a":
      "We offer a 14-day free trial on the Growth plan with no credit card required.",
    "pricing.faq3.q": "What payment methods do you accept?",
    "pricing.faq3.a":
      "We accept all major credit cards, debit cards, and corporate bank transfers.",

    "location.subtitle": "Our Location",
    "location.title": "Visit Our Bangladesh Office",
    "location.badge": "Bangladesh Address",
    "location.officeName": "RealBiz Pro HQ",
    "location.addressTitle": "Baridhara DOHS Office",
    "location.details":
      "House-417, Road-7\nBaridhara DOHS, Dhaka-1206\nBangladesh",
    "location.button": "Get Directions on Google Maps",
    "partner.title": "Join Us as a Partner",
    "partner.description":
      "Collaborate with us to build extraordinary real estate ventures. Whether you are looking to invest or partner on landmark developments, we provide the platform for enduring growth.",
    "partner.card1.title": "For Partners",
    "partner.card1.desc":
      "Engage with us to discover our exclusive projects and uncover the perfect property that aligns with your lifestyle and business aspirations.",
    "partner.card2.title": "For Customers",
    "partner.card2.desc":
      "Engage with us to discover our exclusive projects and uncover the perfect property that aligns with your lifestyle and business aspirations.",

    "buyer.title": "Join Us as a Buyer",
    "buyer.description":
      "Step into your dream property with confidence. Discover our curated collection of exceptional residential and commercial spaces designed to match your lifestyle and future aspirations.",
    "buyer.card1.title": "Prime Locations",
    "buyer.card1.desc":
      "Explore handpicked residential spaces situated in the most sought-after neighborhoods tailored for your comfort.",
    "buyer.card2.title": "Exclusive Homes",
    "buyer.card2.desc":
      "Uncover elegant architecture and contemporary designs built to elevate your everyday living standard.",
    "stats.subtitle": "By The Numbers",
    "stats.title": "Trusted by growing real estate teams",
    "stats.label1": "Properties Managed",
    "stats.label2": "Active Agents",
    "stats.label3": "Cities Covered",
    "stats.label4": "Uptime",

    "testimonials.subtitle": "Testimonials",
    "testimonials.title": "Loved by real estate teams",
    "testimonials.description":
      "Hear from the operators and agents who run their business on RealBiz every day.",
    "testimonials.list": [
      {
        title: "Farhana Rahman · Operations Manager, Greenview Realty",
        description:
          "We went from three different spreadsheets to one dashboard. Our agents actually follow up on leads now because they can see exactly what's due.",
      },
      {
        title: "Imran Chowdhury · Sales Director, Northgate Properties",
        description:
          "The sales pipeline view alone paid for itself in the first month — we finally know which deals are stuck and why.",
      },
      {
        title: "Nadia Islam · Founder, Cedarwood Group",
        description:
          "Setup took an afternoon. Our whole team was using it by the end of the week, no training sessions needed.",
      },
    ],

    "faq.subtitle": "FAQ",
    "faq.title": "Frequently asked questions",
    "faq.list": [
      {
        title: "Can I import my existing leads and properties?",
        description:
          "Yes. You can bulk-import leads and property listings from a spreadsheet during setup, or bring them in anytime from your workspace settings.",
      },
      {
        title: "Does RealBiz support multiple branches?",
        description:
          "Growth and Enterprise plans support multiple branches with their own teams, approval layers, and reporting, all rolled up into one company view.",
      },
      {
        title: "Is there a limit on the number of properties?",
        description:
          "No. Every plan includes unlimited property listings — pricing scales with the number of users, not your inventory size.",
      },
      {
        title: "Can I cancel anytime?",
        description:
          "Yes, plans are month-to-month with no long-term contract. You can cancel or change plans anytime from billing settings.",
      },
    ],

    "cta.title": "Ready to grow your real estate business?",
    "cta.description":
      "Start your free 14-day trial today — no credit card, no setup fees.",
    "cta.button": "Get Started Free",
    "cta.secondary": "Talk to Sales",

    "legacy.eyebrow": "THE REALBIZ STORY",
    "legacy.title": "Built by Operators, for Operators",
    "legacy.titleLine1": "The Blueprint of",
    "legacy.titleAccent": "Growth",
    "legacy.paragraph1":
      "RealBiz started with a simple observation: real estate teams were running multi-crore operations out of spreadsheets and group chats. Leads got lost, follow-ups were missed, and owners had no single view of the business.",
    "legacy.paragraph2":
      "So we built the platform we wished existed — CRM, property sales, billing, and reporting in one place, designed around how real estate businesses in Bangladesh actually work day to day.",
    "legacy.cta": "Learn More",

    "projects.eyebrow": "WHAT'S INSIDE",
    "projects.viewProject": "Explore Module",
    "projects.list": [
      {
        title: "CRM & Lead Management",
        description: "Core Module · Leads & Follow-ups · Live",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Property & Flat Sales",
        description: "Core Module · Booking & Inventory · Live",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Billing & Reports",
        description: "Core Module · Invoicing & KPIs · Live",
        image:
          "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
      },
    ],

    "milestones.founded": "9",
    "milestones.tagline": "One platform for the whole real estate business",
    "milestones.stat1": "Properties Managed",
    "milestones.stat2": "Leads Processed Monthly",
    "milestones.stat3": "Active Agencies",
    "milestones.stat4": "Cities Covered",
    "milestones.stat5": "Modules in One Platform",
    "milestones.stat6": "Platform Uptime %",

    "latest.title": "The platform, module by module",
    "landowner.eyebrow": "FOR LAND OWNERS",
    "landowner.titleLine1": "Turn Your Land Into a",
    "landowner.titleAccent": "Legacy",
    "landowner.description":
      "List your plot, track every offer, and manage the full acquisition process \u2014 negotiation, legal verification, and documentation \u2014 without losing sight of a single detail.",
    "landowner.point1":
      "Get matched with verified agencies actively looking for land",
    "landowner.point2": "Track negotiation status and offers in real time",
    "landowner.point3": "Legal document verification built into every step",
    "landowner.point4": "Follow-up scheduling so no conversation goes cold",
    "landowner.cta": "List Your Land",
    "agency.eyebrow": "FOR AGENCIES",
    "agency.titleLine1": "Run Your Whole",
    "agency.titleAccent": "Business",
    "agency.description":
      "From the first lead to the final handover, give your entire team one shared system for sales, billing, and reporting \u2014 no more juggling five different tools.",
    "agency.point1": "Assign and track leads across every agent automatically",
    "agency.point2": "Manage flats, land, and bookings in one inventory",
    "agency.point3":
      "Generate invoices and track payments without spreadsheets",
    "agency.point4": "See team performance and pipeline health at a glance",
    "agency.cta": "Start Free Trial",
    "process.eyebrow": "HOW IT WORKS",
    "process.title": "From sign-up to your first closed deal",
    "process.step1.title": "Set up your workspace",
    "process.step1.description":
      "Add your company, branches, and team in minutes with a guided setup.",
    "process.step2.title": "Import or add your data",
    "process.step2.description":
      "Bring in existing leads and property listings, or start fresh with our templates.",
    "process.step3.title": "Assign and automate",
    "process.step3.description":
      "Route new leads automatically and let approval layers handle the rest.",
    "process.step4.title": "Track, close, and grow",
    "process.step4.description":
      "Follow every deal to close with reports that show exactly where to focus.",

    "properties.eyebrow": "OUR PORTFOLIO",
    "properties.title": "Browse properties across every stage",
    "properties.description":
      "From plots still under negotiation to flats ready to move in, track every property type your business handles in one catalog.",
    "properties.construction.title": "Under Construction",
    "properties.construction.description":
      "Projects currently being built, tracked from foundation to handover.",
    "properties.readyBuilding.title": "Ready Buildings",
    "properties.readyBuilding.description":
      "Completed buildings with units ready for occupancy.",
    "properties.readyLand.title": "Ready Land",
    "properties.readyLand.description":
      "Verified plots with clear title, ready to transfer.",
    "properties.readyFlat.title": "Ready Flats",
    "properties.readyFlat.description":
      "Finished flats with floor plans and pricing ready to book.",
    "properties.cta": "Enquire Now",

    "about.eyebrow": "ABOUT REALBIZ",
    "about.title": "A platform built from the ground up for real estate",
    "about.paragraph1":
      "RealBiz Pro is built for real estate professionals.\nWe listened to agents, sales managers, and business owners to understand their real-world challenges.\nWe turned those challenges into simple, powerful tools designed for everyday real estate work.\nLess complexity. More productivity. Better real estate management.",
    "about.paragraph2":
      "RealBiz is our answer \u2014 a platform shaped entirely around how real estate businesses in Bangladesh operate day to day, from the first lead call to the final handover.",
    "about.missionTitle": "Our Mission",
    "about.missionText":
      "To give every real estate business, from a five-person agency to a multi-branch developer, the same level of operational clarity that only the biggest players used to have.",
    "about.valuesTitle": "What We Believe",
    "about.value1.title": "Built for operators",
    "about.value1.description":
      "Every feature is designed around the person who has to use it daily, not just the person buying the software.",
    "about.value2.title": "No hidden complexity",
    "about.value2.description":
      "Powerful doesn't have to mean complicated. Teams should be productive within a day of signing up.",
    "about.value3.title": "Data stays yours",
    "about.value3.description":
      "Export anything, anytime. We earn your business every renewal, not through lock-in.",

    "contact.eyebrow": "GET IN TOUCH",
    "contact.title": "Let's talk about your business",
    "contact.description":
      "Have a question about plans, a feature request, or want a live walkthrough? Send us a message and we'll get back to you within one business day.",
    "contact.addressLabel": "Office",
    "contact.address": "Level 6, Gulshan Avenue, Dhaka 1212, Bangladesh",
    "contact.emailLabel": "Email",
    "contact.email": "hello@realbiz.example",
    "contact.phoneLabel": "Phone",
    "contact.phone": "+880 1XXX-XXXXXX",
    "contact.form.name": "Full name",
    "contact.form.email": "Email address",
    "contact.form.company": "Company name",
    "contact.form.message": "How can we help?",
    "contact.form.submit": "Send Message",

    "modules.eyebrow": "Modules",
    "modules.title":
      "Complete ERP Modules for Construction & Real Estate Business",
    "modules.subtitle": "Comprehensive tools designed to streamline operations",
    "modules.showMore": "Show More",
    "modules.showLess": "Show Less",

    "modules.landAcquisition.title": "Land Acquisition CRM",
    "modules.landAcquisition.tagline": "Manage Land Acquisition & Payments",
    "modules.landAcquisition.bullet1": "Land Payment Tracking",
    "modules.landAcquisition.bullet2": "Installment Scheduling",
    "modules.landAcquisition.bullet3": "Profit/Loss Analysis",
    "modules.landAcquisition.bullet4": "Expense Ledger Management",

    "modules.projectManagement.title": "Project Management",
    "modules.projectManagement.tagline": "Project Progress & Material Tracking",
    "modules.projectManagement.bullet1": "Work Scheduling",
    "modules.projectManagement.bullet2": "Budget Management",
    "modules.projectManagement.bullet3": "Material Usage Tracking",
    "modules.projectManagement.bullet4": "Progress Dashboard",

    "modules.crm.title": "CRM",
    "modules.crm.tagline": "Sales, Property Listing & Client CRM",
    "modules.crm.bullet1": "Lead & Opportunity Management",
    "modules.crm.bullet2": "Client Communication & Follow-up",
    "modules.crm.bullet3": "Property Listing & Booking",
    "modules.crm.bullet4": "Sales Pipeline Tracking",

    "modules.salesCustomer.title": "Sales & Customer",
    "modules.salesCustomer.tagline": "Sales, Property Listing & Client CRM",
    "modules.salesCustomer.bullet1": "Lead Management",
    "modules.salesCustomer.bullet2": "Client Communication Logs",
    "modules.salesCustomer.bullet3": "Property Booking",
    "modules.salesCustomer.bullet4": "Sales Agreements",

    "modules.creditRealization.title": "Credit Realization / Collection (CR)",
    "modules.creditRealization.tagline": "Credit & Collection Management",
    "modules.creditRealization.bullet1": "Customer Credit Tracking",
    "modules.creditRealization.bullet2": "Collection Automation",
    "modules.creditRealization.bullet3": "Due Date Alerts",
    "modules.creditRealization.bullet4": "Profit/Loss Reporting",

    "modules.materialsProcurement.title": "Materials & Procurement",
    "modules.materialsProcurement.tagline": "Material/Procurement Tracking",
    "modules.materialsProcurement.bullet1": "Material Request",
    "modules.materialsProcurement.bullet2": "Procurement Approval",
    "modules.materialsProcurement.bullet3": "Usage Tracking",
    "modules.materialsProcurement.bullet4": "Stock Reorder Alerts",

    "modules.accountsFinance.title": "Accounts & Finance",
    "modules.accountsFinance.tagline": "Financial Management",
    "modules.accountsFinance.bullet1": "Invoice Automation",
    "modules.accountsFinance.bullet2": "Expense Management",
    "modules.accountsFinance.bullet3": "Installment Tracking",
    "modules.accountsFinance.bullet4": "Financial Reports",

    "modules.hrPayroll.title": "HR & Payroll",
    "modules.hrPayroll.tagline": "Human Resources & Payroll",
    "modules.hrPayroll.bullet1": "Attendance & Leave",
    "modules.hrPayroll.bullet2": "Salary & Bonus",
    "modules.hrPayroll.bullet3": "Advance & Overtime",
    "modules.hrPayroll.bullet4": "Auto Payroll System",

    "modules.inventory.title": "Inventory",
    "modules.inventory.tagline": "Inventory & Stock Management",
    "modules.inventory.bullet1": "Stock Management",
    "modules.inventory.bullet2": "Inventory Reports",
    "modules.inventory.bullet3": "Low Stock Alerts",
    "modules.inventory.bullet4": "Item Tracking",

    "modules.purchaseVendor.title": "Purchase & Vendor",
    "modules.purchaseVendor.tagline": "Procurement & Supplier Management",
    "modules.purchaseVendor.bullet1": "Purchase Requests",
    "modules.purchaseVendor.bullet2": "Vendor Bill Payments",
    "modules.purchaseVendor.bullet3": "Stock Alerts",
    "modules.purchaseVendor.bullet4": "Variance Analysis",

    "modules.customerService.title": "Customer Service / After-Sales",
    "modules.customerService.tagline": "Client Support & Service",
    "modules.customerService.bullet1": "Client Issue Tracking",
    "modules.customerService.bullet2": "Feedback Management",
    "modules.customerService.bullet3": "Follow-up Notifications",
    "modules.customerService.bullet4": "Service Reports",

    "modules.reportsAnalytics.title": "Reports & Analytics",
    "modules.reportsAnalytics.tagline": "Business Dashboard & Reports",
    "modules.reportsAnalytics.bullet1": "Financial Statements",
    "modules.reportsAnalytics.bullet2": "Cost Analysis",
    "modules.reportsAnalytics.bullet3": "Cash Flow Reports",
    "modules.reportsAnalytics.bullet4": "Project-wise Profit Reports",

    "modules.boq.title": "BOQ",
    "modules.boq.tagline": "Bill of Quantities & Project Documentation",
    "modules.boq.bullet1": "Detailed Bill of Quantities Creation",
    "modules.boq.bullet2": "Material & Cost Estimation",
    "modules.boq.bullet3": "Version Control & Document History",
    "modules.boq.bullet4": "Secure Storage & Sharing",

    "modules.settingsSecurity.title": "Settings & Security",
    "modules.settingsSecurity.tagline": "System Setup & Access Control",
    "modules.settingsSecurity.bullet1": "User Role Management",
    "modules.settingsSecurity.bullet2": "Data Backup & Security",
    "modules.settingsSecurity.bullet3": "Module Customization",
    "modules.settingsSecurity.bullet4": "Audit Logs",

    "modules.documentManagement.title": "Document Management",
    "modules.documentManagement.tagline": "Document & File Management",
    "modules.documentManagement.bullet1": "Centralized Storage",
    "modules.documentManagement.bullet2": "Version Control",
    "modules.documentManagement.bullet3": "Secure Sharing",
    "modules.documentManagement.bullet4": "Easy Retrieval",

    "whyRealBiz.eyebrow": "Features",
    "whyRealBiz.title": "Why RealBiz?",
    "whyRealBiz.subtitle":
      "Powerful capabilities built for modern construction and real estate operations",

    "whyRealBiz.accountsFinance.title":
      "Accounts, Installment & Finance Control",
    "whyRealBiz.accountsFinance.desc":
      "Automatically and accurately manage installments, invoices, receipts, payments, ledgers, and balance sheets.",

    "whyRealBiz.purchaseVendor.title": "Purchase & Vendor Management",
    "whyRealBiz.purchaseVendor.desc":
      "Track everything in the system—what materials are needed, when, total costs, and supplier details.",

    "whyRealBiz.salesCrm.title": "Sales, Property Listing & CRM",
    "whyRealBiz.salesCrm.desc":
      "Manage everything in one place, from incoming leads to signed contracts. Never lose a potential lead again.",

    "whyRealBiz.projectTracking.title": "Project Progress & Material Tracking",
    "whyRealBiz.projectTracking.desc":
      "Monitor project schedules, costing, material usage records, and real-time site progress instantly.",

    "whyRealBiz.hrPayroll.title": "HR & Payroll Management",
    "whyRealBiz.hrPayroll.desc":
      "Automate staff attendance, leave management, salaries, advances, and overtime all in one payroll system.",

    "whyRealBiz.autoReminders.title": "Auto Reminders & Follow-up System",
    "whyRealBiz.autoReminders.desc":
      "Send automated SMS/Email updates for client payments, scheduled meetings, or contract milestones.",

    "whyRealBiz.dashboardReports.title": "Business Dashboard & Reports",
    "whyRealBiz.dashboardReports.desc":
      "View profit/loss, cost breakdown, cash flow, and sales reports in a single click.",

    "whyRealBiz.anytimeAccess.title": "Access Anytime, Anywhere",
    "whyRealBiz.anytimeAccess.desc":
      "Access your full system at the office, on site, at home, or while traveling via mobile or laptop.",

    "solutions.construction.eyebrow": "CONSTRUCTION & REAL ESTATE",

    "solutions.construction.title": "Construction & Real Estate",

    "solutions.construction.subtitle": "Complete Digital Solution",

    "solutions.construction.modules": "ERP • CRM • HR",

    "solutions.construction.brand": "RealBiz ERP",

    "solutions.construction.description":
      "- Land Acquisition CRM, Project Management, CRM, Sales Management, Credit Realization/Collection (CR), Materials & Procurement, Accounts, HR & Payroll, Inventory, Customer Service/After-Sales — everything in one platform.",

    "solutions.construction.demoButton": "Get a Demo",

    "solutions.construction.learnMoreButton": "Learn More",

    // Process
    "solutions.process.01.title": "Land Acquisition",

    "solutions.process.01.subtitle": "CRM",

    "solutions.process.02.title": "Project Management",

    "solutions.process.03.title": "CRM",

    "solutions.process.04.title": "Sales Management",

    "solutions.process.05.title": "Credit Realization /",

    "solutions.process.05.subtitle": "Collection (CR)",

    "solutions.process.06.title": "Materials & Procurement",

    "solutions.process.07.title": "Accounts",

    "solutions.process.08.title": "HR & Payroll",

    "solutions.process.09.title": "Inventory",

    "solutions.process.10.title": "Customer Service /",

    "solutions.process.10.subtitle": "After-Sales",
    "solutions.eyebrow": "Solutions",
    "solutions.title": "Working in Real Estate, Construction, or Development?",
    "solutions.subtitle":
      "Say goodbye to manual work today and make your business smart & systematic.",

    "solutions.accountsFinance.title":
      "1. Accounts, Installment & Finance Control",
    "solutions.accountsFinance.desc":
      "Installments, invoices, receipts, payments, ledgers, and balance sheets—everything managed automatically and accurately.",

    "solutions.purchaseVendor.title": "2. Purchase & Vendor Management",
    "solutions.purchaseVendor.desc":
      "Track everything in the system: what materials are needed, when, total costs, and supplier details.",

    "solutions.salesCrm.title": "3. Sales, Property Listing & Client CRM",
    "solutions.salesCrm.desc":
      "Manage everything in one place, from incoming leads to signed contracts. Never lose a lead again.",

    "solutions.projectTracking.title":
      "4. Project Progress & Material Tracking",
    "solutions.projectTracking.desc":
      "Monitor project schedules, costing, material usage records, and site progress in real time.",

    "solutions.hrPayroll.title": "5. HR & Payroll Management",
    "solutions.hrPayroll.desc":
      "Attendance, leave, salary, advance, and overtime—everything automated in a single payroll system.",

    "solutions.autoReminders.title": "6. Auto Reminders & Follow-up System",
    "solutions.autoReminders.desc":
      "Send automated SMS/Email updates for client payments, meetings, or contract milestones.",

    "solutions.dashboardReports.title": "7. Business Dashboard & Reports",
    "solutions.dashboardReports.desc":
      "View profit & loss, cost breakdown, cash flow, and sales reports in a single click.",

    "solutions.anytimeAccess.title": "8. Access Anytime, Anywhere",
    "solutions.anytimeAccess.desc":
      "Access your entire system on mobile or laptop—whether at the office, site, home, or traveling.",

    "solutions.documentManagement.title": "9. Document Management",
    "solutions.documentManagement.desc":
      "Store and easily access contracts, reports, and all other important documents in one secure location.",

    "services.hero.eyebrow": "End-to-End Real Estate ERP",
    "services.hero.title": "Services & Capabilities",
    "services.hero.subtitle":
      "Discover how our specialized software modules streamline land sourcing, site engineering, customer management, and financial control.",

    "storyline.title": "The Storyline of",
    "storyline.legacy": "RealBiz Pro",

    "storyline.description":
      "RealBiz Pro brings together innovation, technology, and smart solutions to transform the way businesses operate. Built with a vision for efficiency, transparency, and sustainable growth, we are dedicated to creating solutions that make business simpler, smarter, and more connected.",

    "storyline.content":
      "RealBiz Pro is designed to empower businesses with modern digital solutions, intelligent management tools, and seamless workflows. From operations and finance to real estate and business management, RealBiz Pro connects every part of your organization and helps you build a smarter future.",

    "services.landAcquisition.title": "1. Land Acquisition & Plotting",
    "services.landAcquisition.desc":
      "Manage land sourcing, landowner agreements, legal documentation, and automated plot allocation in a single integrated workflow.",
    "services.landAcquisition.feat1": "Plot mapping & tracking",
    "services.landAcquisition.feat2": "Agreement & deed history",
    "services.landAcquisition.feat3": "Landowner payment schedules",
    "services.landAcquisition.feat4": "Document approval pipeline",

    "services.projectManagement.title": "2. Construction & Site Operations",
    "services.projectManagement.desc":
      "Monitor project milestones, material consumption on-site, contractor bills, and daily work progress with real-time field tracking.",
    "services.projectManagement.feat1": "Milestone & schedule tracking",
    "services.projectManagement.feat2": "Contractor measurement sheets",
    "services.projectManagement.feat3": "Material requisition logs",
    "services.projectManagement.feat4": "On-site progress photos & audits",

    "services.crmSales.title": "3. Sales, Lead & CRM Operations",
    "services.crmSales.desc":
      "Accelerate customer conversion, track leads from inquiry to booking, manage customer interactions, and automate follow-up tasks.",
    "services.crmSales.feat1": "Omnichannel lead capture",
    "services.crmSales.feat2": "Automated sales pipelines",
    "services.crmSales.feat3": "Unit booking & hold status",
    "services.crmSales.feat4": "Customer communication history",

    "services.financeAccounts.title": "4. Financial Control & Accounting",
    "services.financeAccounts.desc":
      "Gain total visibility over project budgets, customer installments, ledger entries, tax compliance, and automated financial forecasting.",
    "services.financeAccounts.feat1": "Real-time ledger updates",
    "services.financeAccounts.feat2": "Installment & penalty automation",
    "services.financeAccounts.feat3": "Project cost accounting",
    "services.financeAccounts.feat4": "Multi-bank reconciliation",

    "services.materialsInventory.title":
      "5. Materials, Warehouse & Procurement",
    "services.materialsInventory.desc":
      "Prevent material leakage with strict inventory controls, vendor purchase orders, warehouse stock movement, and gate-pass tracking.",
    "services.materialsInventory.feat1":
      "Stock level alerts & safety thresholds",
    "services.materialsInventory.feat2": "Vendor purchase order workflows",
    "services.materialsInventory.feat3": "Site-to-site transfer logs",
    "services.materialsInventory.feat4": "Gate-pass & delivery verification",

    "services.analyticsReporting.title": "6. Business Intelligence & Analytics",
    "services.analyticsReporting.desc":
      "Make informed executive decisions with interactive dashboards, custom financial reports, project health metrics, and growth forecasts.",
    "services.analyticsReporting.feat1": "Interactive executive dashboards",
    "services.analyticsReporting.feat2": "Custom report generator",
    "services.analyticsReporting.feat3": "Project ROI & margin analysis",
    "services.analyticsReporting.feat4": "Exportable PDF/Excel insights",
  },
  bn: {
    "nav.home": "হোম",
    "nav.features": "ফিচারস ",
    "nav.pricing": "প্রাইসিং",
    "nav.about": "সম্পর্কে",
    "nav.contact": "যোগাযোগ",
    "nav.login": "লগ ইন",
    "language.english": "ইংরেজি",
    "language.bangla": "বাংলা",
    "theme.light": "আলো",
    "theme.dark": "অন্ধকার",
    "hero.title": "উন্নত বাস্তব সম্পত্তি ব্যবসা তৈরি করুন",
    "hero.description":
      "প্রপার্টি ম্যানেজমেন্ট সুবিন্যাস করুন, কর্মপ্রবাহ অটোমেট করুন এবং RealBiz-এর বুদ্ধিমান প্ল্যাটফর্মের সাথে আপনার পোর্টফোলিও বাড়ান।",
    "hero.cta": "নিজামত শুরু করুন",
    "hero.dashboardAlt": "RealBiz ড্যাশবোর্ড প্রিভিউ",
    "footer.copyright":
      "© {year} RealBiz. অপারেটরদের জন্য তৈরি, শুধু মালিকদের জন্য নয়।",
    "footer.tagline": "RealBiz",
    "features.title": "এক প্ল্যাটফর্মে আপনার যা কিছু দরকার",
    "features.subtitle": "আমাদের বৈশিষ্ট্য",
    "features.description":
      "আপনার ব্যবসার প্রতিটি অংশ একটি সহজ প্ল্যাটফর্ম থেকে পরিচালনা করতে সাহায্য করার জন্য তৈরি শক্তিশালী টুলস।",
    "features.viewAll": "সব বৈশিষ্ট্য দেখুন",
    "features.view": "দেখুন",
    "features.uptime": "৯৯.৯% আপটাইম",
    "features.support": "২৪/৭ সাপোর্ট",
    "features.noCard": "ক্রেডিট কার্ড লাগবে না",
    "features.list": [
      {
        title: "প্রপার্টি ম্যানেজমেন্ট",
        description:
          "এক জায়গা থেকে প্রপার্টি, ইউনিট, উপলব্ধতা, মূল্য এবং প্রপার্টি তথ্য পরিচালনা করুন।",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "প্রপার্টি লিস্টিং",
        description:
          "ছবি, বিবরণ, লোকেশন এবং মূল্যের সাথে প্রপার্টি লিস্টিং তৈরি এবং পরিচালনা করুন।",
        image:
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "লিডস এবং সিআরএম",
        description:
          "সম্ভাব্য ক্রেতা ট্র্যাক করুন, লিড ম্যানেজ করুন এবং শক্তিশালী কাস্টমার সম্পর্ক তৈরি করুন।",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "বিক্রয় এবং বুকিং",
        description:
          "প্রপার্টি বিক্রয়, বুকিং, কাস্টমার, পেমেন্ট এবং বুকিং স্ট্যাটাস সহজে পরিচালনা করুন।",
        image:
          "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "প্রজেক্ট ম্যানেজমেন্ট",
        description:
          "বাস্তব সম্পত্তি প্রজেক্ট, নির্মাণের অগ্রগতি, টাস্ক এবং প্রজেক্ট কার্যক্রম পর্যবেক্ষণ করুন।",
        image:
          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "অ্যাকাউন্টস এবং ফাইন্যান্স",
        description:
          "আপনার ব্যবসার জন্য পেমেন্ট, খরচ, ইনভয়েস এবং আর্থিক লেনদেন পরিচালনা করুন।",
        image:
          "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
      },
    ],
    "services.title": "প্রতিটি প্রয়োজনের জন্য পেশাদার বাস্তব সম্পত্তি সেবা।",
    "services.subtitle": "রিয়েল এস্টেট সেবা",
    "services.description":
      "আমরা আপনার সম্পত্তির যাত্রাকে সহজ, নিরাপদ এবং সফল করার জন্য ডিজাইন করা প্রফেশনাল সেবার বিস্তৃত রেঞ্জের সাথে প্রিমিয়াম বাস্তব সম্পত্তি সমাধান প্রদান করি।",
    "services.feature1": "কাস্টমাইজড প্রপার্টি মার্কেটিং",
    "services.feature2": "প্রপার্টি ভ্যালুয়েশন সার্ভিস",
    "services.feature3": "মার্কেট রিসার্চ এবং অ্যানালিসিস",
    "services.explore": "আরও এক্সপ্লোর করুন",
    "services.imageAlt1": "আধুনিক লাক্সারি বাস্তব সম্পত্তি প্রপার্টি",
    "services.imageAlt2": "লাক্সারি আবাসিক ভবন",

    // Pricing Section (Bangla)
    "pricing.badge": "প্রাইসিং প্ল্যান",
    "pricing.subtitle": "মূল্য",
    "pricing.title": "সহজ মূল্য, আপনার টিমের সাথে বাড়ে",
    "pricing.description":
      "ফ্রি শুরু করুন, টিম বাড়লে আপগ্রেড করুন। কোনো লুকিয়িত ফি বা দীর্ঘমেয়াদী চুক্তি নেই।",
    "pricing.monthly": "মাসিক",
    "pricing.yearly": "বার্ষিক",
    "pricing.saveBadge": "~২০% সাশ্রয়",
    "pricing.popular": "সবচেয়ে জনপ্রিয়",
    "pricing.perMonth": "/মাস",
    "pricing.perYear": "/বছর",
    "pricing.billedMonthly": "মাসিক বিল দেওয়া হবে",
    "pricing.custom": "কাস্টম",
    "pricing.cta": "সম্পূর্ণ মূল্য তালিকা দেখুন",
    "pricing.faqTitle": "সাধারণ জিজ্ঞাসাসমূহ",

    "pricing.starter.name": "স্টার্টার",
    "pricing.starter.description":
      "ছোট টিম বা একক এজেন্টদের জন্য প্রয়োজনীয় টুলস।",
    "pricing.starter.cta": "শুরু করুন",
    "pricing.starter.f1": "সর্বোচ্চ ৫০টি সক্রিয় লিস্টিং",
    "pricing.starter.f2": "বেসিক লিড সিআরএম",
    "pricing.starter.f3": "২ জন টিম মেম্বার সিট",
    "pricing.starter.f4": "ইমেল সহায়তা",

    "pricing.growth.name": "গ্রোথ",
    "pricing.growth.description":
      "কার্যক্রম অটোমেট করতে চাওয়া টিমের জন্য আদর্শ।",
    "pricing.growth.cta": "১৪ দিনের ফ্রি ট্রায়াল শুরু করুন",
    "pricing.growth.note": "বার্ষিক বিলে $৬৫/মাস",
    "pricing.growth.f1": "আনলিমিটেড লিস্টিং",
    "pricing.growth.f2": "অ্যাডভান্সড লিড সিআরএম ও সেলস পাইপলাইন",
    "pricing.growth.f3": "১০ জন টিম মেম্বার সিট",
    "pricing.growth.f4": "মাল্টি-ব্রাঞ্চ ম্যানেজমেন্ট",
    "pricing.growth.f5": "অগ্রাধিকার ২৪/৭ সাপোর্ট",

    "pricing.enterprise.name": "এন্টারপ্রাইজ",
    "pricing.enterprise.description":
      "বড় এজেন্সির জন্য কাস্টমাইজড ফিচার ও সাপোর্ট।",
    "pricing.enterprise.cta": "সেলসের সাথে কথা বলুন",
    "pricing.enterprise.note": "আপনার ব্যবসার আকার অনুযায়ী নির্ধারিত",
    "pricing.enterprise.f1": "গ্রোথ প্ল্যানের সব ফিচার",
    "pricing.enterprise.f2": "আনলিমিটেড টিম সিট",
    "pricing.enterprise.f3": "কাস্টম API ও CRM ইন্টিগ্রেশন",
    "pricing.enterprise.f4": "ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার",
    "pricing.enterprise.f5": "কাস্টম SLA ও আপটাইম গ্যারান্টি",

    "pricing.faq1.q": "আমি কি পরে প্ল্যান পরিবর্তন করতে পারব?",
    "pricing.faq1.a":
      "হ্যাঁ, যেকোনো সময় বিলিং সেটিংস থেকে আপগ্রেড বা ডাউনগ্রেড করতে পারেন — এটি পরবর্তী সাইকেল থেকে কার্যকর হবে।",
    "pricing.faq2.q": "ফ্রি ট্রায়াল শেষ হওয়ার পর কী হবে?",
    "pricing.faq2.a":
      "আপনাকে একটি প্ল্যান বেছে নিতে বলা হবে। আপনার অনুমতি ছাড়া কোনো চার্জ নেওয়া হবে না।",
    "pricing.faq3.q": "আপনারা কি পেমেন্ট মেথড গ্রহণ করেন?",
    "pricing.faq3.a":
      "আমরা সমস্ত প্রধান ক্রেডিট কার্ড, ডেবিট কার্ড এবং কর্পোরেট ব্যাংক ট্রান্সফার গ্রহণ করি।",

    "location.subtitle": "আমাদের লোকেশন",
    "location.title": "আমাদের বাংলাদেশ অফিস ভিজিট করুন",
    "location.badge": "বাংলাদেশ ঠিকানা",
    "location.officeName": "রিয়েলবিজ প্রো হেডকোয়ার্টার্স",
    "location.addressTitle": "বারিধারা ডিওএইচএস অফিস",
    "location.details":
      "হাউস-৪১৭, রোড-৭\nবারিধারা ডিওএইচএস, ঢাকা-১২০৬\nবাংলাদেশ",
    "location.button": "গুগল ম্যাপে দিকনির্দেশনা দেখুন",
    "partner.title": "আমাদের অংশীদার হিসেবে যোগ দিন",
    "partner.description":
      "অসাধারণ রিয়েল এস্টেট উদ্যোগ তৈরিতে আমাদের সাথে সহযোগিতা করুন। আপনি বিনিয়োগ করতে চান বা উল্লেখযোগ্য উন্নয়ন প্রকল্পে অংশীদার হতে চান, আমরা টেকসই প্রবৃদ্ধির প্ল্যাটফর্ম প্রদান করি।",
    "partner.card1.title": "অংশীদারদের জন্য",
    "partner.card1.desc":
      "আমাদের একচেটিয়া প্রকল্পগুলি আবিষ্কার করতে এবং আপনার জীবনধারা এবং ব্যবসায়িক আকাঙ্ক্ষার সাথে সামঞ্জস্যপূর্ণ নিখুঁত সম্পত্তি উন্মাদন করতে আমাদের সাথে যুক্ত হন।",
    "partner.card2.title": "গ্রাহকদের জন্য",
    "partner.card2.desc":
      "আমাদের একচেটিয়া প্রকল্পগুলি আবিষ্কার করতে এবং আপনার জীবনধারা এবং ব্যবসায়িক আকাঙ্ক্ষার সাথে সামঞ্জস্যপূর্ণ নিখুঁত সম্পত্তি উন্মাদন করতে আমাদের সাথে যুক্ত হন।",
    "stats.subtitle": "সংখ্যায় আমরা",
    "stats.title": "বর্ধনশীল রিয়েল এস্টেট টিমের আস্থা",
    "stats.label1": "প্রপার্টি পরিচালিত",
    "stats.label2": "সক্রিয় এজেন্ট",
    "stats.label3": "শহর কভার করা",
    "stats.label4": "আপটাইম",

    "testimonials.subtitle": "প্রশংসাপত্র",
    "testimonials.title": "রিয়েল এস্টেট টিমের পছন্দ",
    "testimonials.description":
      "যারা প্রতিদিন RealBiz-এ তাদের ব্যবসা চালান, তাদের অভিজ্ঞতা শুনুন।",
    "testimonials.list": [
      {
        title: "ফরহানা রহমান · অপারেশন্স ম্যানেজার, Greenview Realty",
        description:
          "আমরা তিনটি আলাদা স্প্রেডশিট থেকে একটি ড্যাশবোর্ডে এসেছি। এখন আমাদের এজেন্টরা দেখতে পারে কি বাকি আছে বলে সত্যিকারই ফলো-আপ করে।",
      },
      {
        title: "ইমরান চৌধুরী · সেলস ডিরেক্টর, Northgate Properties",
        description:
          "শুধু সেলস পাইপলাইন ভিউটিই প্রথম মাসেই নিজেকে প্রমাণ করেছে — এখন আমরা জানি কোন ডিলগুলো আটকে আছে এবং কেন।",
      },
      {
        title: "নাদিয়া ইসলাম · প্রতিষ্ঠাতা, Cedarwood Group",
        description:
          "সেটআপ সময় লেগেছে এক বিকেল। সপ্তাহের শেষের মধ্যেই আমাদের পুরো টিম এটি ব্যবহার করতে শুরু করে, কোনো প্রশিক্ষণ ছাড়াই।",
      },
    ],

    "faq.subtitle": "সাধারণ প্রশ্ন",
    "faq.title": "প্রায়ই জিজ্ঞাসিত প্রশ্ন",
    "faq.list": [
      {
        title: "আমি কি আমার বিদ্যমান লিড এবং প্রপার্টি আমদানি করতে পারব?",
        description:
          "হ্যাঁ, আপনি সেটআপের সময় একটি স্প্রেডশিট থেকে বাল্ক-ইম্পোর্ট করতে পারেন, বা যেকোনো সময় ওয়ার্কস্পেস সেটিংস থেকে যোগ করতে পারেন।",
      },
      {
        title: "RealBiz কি বিভিন্ন শাখা সমর্থন করে?",
        description:
          "Growth এবং Enterprise প্ল্যানে বিভিন্ন শাখার নিজস্ব টিম, অনুমোদন স্তর এবং রিপোর্টিং সমর্থিত, সব একটি কোম্পানি ভিউতে একত্রিত।",
      },
      {
        title: "প্রপার্টির সংখ্যার কোনো সীমা আছে কি?",
        description:
          "না। প্রতিটি প্ল্যানে অসীমিত প্রপার্টি লিস্টিং অন্তর্ভুক্ত — মূল্য নির্ভর করে ব্যবহারকারীর সংখ্যার উপর, আপনার ইনভেন্টরির আকারের উপর নয়।",
      },
      {
        title: "আমি কি যেকোনো সময় বাতিল করতে পারব?",
        description:
          "হ্যাঁ, প্ল্যানগুলি মাসিক ভিত্তিক, কোনো দীর্ঘমেয়াদী চুক্তি নেই। বিলিং সেটিংস থেকে যেকোনো সময় বাতিল বা প্ল্যান পরিবর্তন করতে পারবেন।",
      },
    ],

    "cta.title": "আপনার রিয়েল এস্টেট ব্যবসা বাড়াতে প্রস্তুত?",
    "cta.description":
      "আজই আপনার ফ্রি ১৪ দিনের ট্রায়াল শুরু করুন — কোনো কার্ড বা সেটআপ ফি ছাড়াই।",
    "cta.button": "ফ্রি শুরু করুন",
    "cta.secondary": "সেলসের সাথে কথা বলুন",

    "legacy.eyebrow": "রিয়েলবিজের গল্প",
    "legacy.title": "অপারেটরদের দ্বারা, অপারেটরদের জন্য তৈরি",
    "legacy.titleLine1": "দ্য ব্লুপ্রিন্ট ",
    "legacy.titleAccent": "অব গ্রোথ",
    "legacy.paragraph1":
      "RealBiz শুরু হয়েছিল একটি সাধারণ পর্যবেক্ষণ থেকে: রিয়েল এস্টেট টিমগুলো কোটি টাকার কার্যক্রম চালাচ্ছিল স্প্রেডশিট আর গ্রুপ চ্যাটের উপর ভিত্তি করে। লিড হারিয়ে যেত, ফলো-আপ মিস হতো, আর মালিকদের ব্যবসার কোনো একক দৃষ্টিভঙ্গি ছিল না।",
    "legacy.paragraph2":
      "তাই আমরা এমন একটি প্ল্যাটফর্ম তৈরি করেছি যা আমরা নিজেরাই চেয়েছিলাম — CRM, প্রপার্টি বিক্রয়, বিলিং এবং রিপোর্টিং সব একসাথে, বাংলাদেশের রিয়েল এস্টেট ব্যবসাগুলো যেভাবে দৈনন্দিন কাজ করে তার উপর ভিত্তি করে ডিজাইন করা।",
    "legacy.cta": "আরও জানুন",

    "projects.eyebrow": "যা কিছু আছে ভিতরে",
    "projects.viewProject": "মডিউল দেখুন",
    "projects.list": [
      {
        title: "CRM ও লিড ম্যানেজমেন্ট",
        description: "মূল মডিউল · লিড ও ফলো-আপ · লাইভ",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "প্রপার্টি ও ফ্ল্যাট বিক্রয়",
        description: "মূল মডিউল · বুকিং ও ইনভেন্টরি · লাইভ",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "বিলিং ও রিপোর্ট",
        description: "মূল মডিউল · ইনভয়েসিং ও KPI · লাইভ",
        image:
          "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
      },
    ],

    "milestones.founded": "৯",
    "milestones.tagline": "পুরো রিয়েল এস্টেট ব্যবসার জন্য একটি প্ল্যাটফর্ম",
    "milestones.stat1": "প্রপার্টি পরিচালিত",
    "milestones.stat2": "মাসিক লিড প্রসেস করা হয়েছে",
    "milestones.stat3": "সক্রিয় এজেন্সি",
    "milestones.stat4": "শহর কভার করা",
    "milestones.stat5": "একই প্ল্যাটফর্মে মডিউল",
    "milestones.stat6": "প্ল্যাটফর্ম আপটাইম %",

    "latest.title": "প্ল্যাটফর্ম, মডিউল অনুযায়ী",
    "landowner.eyebrow": "জমির মালিকদের জন্য",
    "landowner.titleLine1": "আপনার জমিকে একটি",
    "landowner.titleAccent": "উত্তরাধিকার",
    "landowner.description":
      "আপনার প্লট তালিকাভুক্ত করুন, প্রতিটি অফার ট্র্যাক করুন এবং সম্পূর্ণ অধিগ্রহণ প্রক্রিয়া \u2014 নেগোসিয়েশন, আইনি যাচাই এবং ডকুমেন্টেশন \u2014 কোনো বিবরণ না হারিয়ে পরিচালনা করুন।",
    "landowner.point1":
      "যাচাইকৃত এজেন্সির সাথে মিলিত হন যারা সক্রিয়ভাবে জমি খুঁজছে",
    "landowner.point2":
      "রিয়েল-টাইমে নেগোসিয়েশন স্ট্যাটাস এবং অফার ট্র্যাক করুন",
    "landowner.point3": "প্রতিটি ধাপে আইনি নথি যাচাই অন্তর্ভুক্ত",
    "landowner.point4": "ফলো-আপ শিডিউলিং যাতে কোনো কথোপকথন ঠান্ডা না হয়",
    "landowner.cta": "আপনার জমি তালিকাভুক্ত করুন",
    "agency.eyebrow": "এজেন্সিদের জন্য",
    "agency.titleLine1": "আপনার পুরো ব্যবসা",
    "agency.titleAccent": "পরিচালনা করুন",
    "agency.description":
      "প্রথম লিড থেকে চূড়ান্ত হ্যান্ডওভার পর্যন্ত, আপনার পুরো টিমকে সেলস, বিলিং এবং রিপোর্টিংয়ের জন্য একটি ভাগ করা সিস্টেম দিন \u2014 পাঁচটি ভিন্ন টুল আর জাগল করতে হবে না।",
    "agency.point1":
      "প্রতিটি এজেন্ট জুড়ে স্বয়ংক্রিয়ভাবে লিড বরাদ্দ ও ট্র্যাক করুন",
    "agency.point2": "একটি ইনভেন্টরিতে ফ্ল্যাট, জমি এবং বুকিং পরিচালনা করুন",
    "agency.point3": "স্প্রেডশিট ছাড়াই ইনভয়েস তৈরি এবং পেমেন্ট ট্র্যাক করুন",
    "agency.point4": "এক নজরে টিমের কর্মক্ষমতা এবং পাইপলাইনের অবস্থা দেখুন",
    "agency.cta": "ফ্রি ট্রায়াল শুরু করুন",
    "process.eyebrow": "কিভাবে কাজ করে",
    "process.title": "সাইন-আপ থেকে আপনার প্রথম বন্ধ হওয়া ডিল পর্যন্ত",
    "process.step1.title": "আপনার ওয়ার্কস্পেস সেট আপ করুন",
    "process.step1.description":
      "গাইডেড সেটআপের মাধ্যমে মিনিটের মধ্যে আপনার কোম্পানি, শাখা এবং টিম যোগ করুন।",
    "process.step2.title": "আপনার ডেটা আমদানি বা যোগ করুন",
    "process.step2.description":
      "বিদ্যমান লিড এবং প্রপার্টি লিস্টিং নিয়ে আসুন, বা আমাদের টেমপ্লেট দিয়ে নতুন করে শুরু করুন।",
    "process.step3.title": "বরাদ্দ এবং অটোমেট করুন",
    "process.step3.description":
      "নতুন লিড স্বয়ংক্রিয়ভাবে রুট করুন এবং বাকিটা অনুমোদন স্তরকে করতে দিন।",
    "process.step4.title": "ট্র্যাক করুন, বন্ধ করুন এবং বাড়ান",
    "process.step4.description":
      "রিপোর্টের সাহায্যে প্রতিটি ডিল বন্ধ পর্যন্ত অনুসরণ করুন যা দেখায় ঠিক কোথায় মনোযোগ দিতে হবে।",

    "properties.eyebrow": "আমাদের পোর্টফোলিও",
    "properties.title": "প্রতিটি ধাপের প্রপার্টি ব্রাউজ করুন",
    "properties.description":
      "এখনও নেগোসিয়েশনে থাকা প্লট থেকে শুরু করে বসবাসের জন্য প্রস্তুত ফ্ল্যাট পর্যন্ত, আপনার ব্যবসার পরিচালিত প্রতিটি প্রপার্টি ধরন এক ক্যাটালগে ট্র্যাক করুন।",
    "properties.construction.title": "নির্মাণাধীন",
    "properties.construction.description":
      "ফাউন্ডেশন থেকে হ্যান্ডওভার পর্যন্ত ট্র্যাক করা বর্তমানে নির্মাণাধীন প্রকল্প।",
    "properties.readyBuilding.title": "প্রস্তুত ভবন",
    "properties.readyBuilding.description":
      "বসবাসের জন্য প্রস্তুত ইউনিটসহ সম্পূর্ণ ভবন।",
    "properties.readyLand.title": "প্রস্তুত জমি",
    "properties.readyLand.description":
      "সুস্পষ্ট দলিলসহ হস্তান্তরযোগ্য যাচাইকৃত প্লট।",
    "properties.readyFlat.title": "প্রস্তুত ফ্ল্যাট",
    "properties.readyFlat.description":
      "ফ্লোর প্ল্যান ও মূল্যসহ বুকিংয়ের জন্য প্রস্তুত সম্পূর্ণ ফ্ল্যাট।",
    "properties.cta": "এখনই জিজ্ঞাসা করুন",

    "about.eyebrow": "রিয়েলবিজ সম্পর্কে",
    "about.title": "রিয়েল এস্টেটের জন্য শুরু থেকে তৈরি একটি প্ল্যাটফর্ম",
    "about.paragraph1":
      "RealBiz Pro তৈরি হয়েছে রিয়েল এস্টেট পেশাজীবীদের জন্য।\nআমরা এজেন্ট, সেলস ম্যানেজার ও ব্যবসার মালিকদের বাস্তব অভিজ্ঞতা শুনেছি।\nতাদের সমস্যার সমাধানে তৈরি করেছি সহজ ও শক্তিশালী টুল।\nকম জটিলতা। বেশি productivity। আরও সহজ real estate management।",
    "about.paragraph2":
      "RealBiz হলো আমাদের উত্তর \u2014 বাংলাদেশের রিয়েল এস্টেট ব্যবসাগুলো দৈনন্দিন যেভাবে কাজ করে তার উপর সম্পূর্ণভাবে গড়া একটি প্ল্যাটফর্ম, প্রথম লিড কল থেকে চূড়ান্ত হ্যান্ডওভার পর্যন্ত।",
    "about.missionTitle": "আমাদের লক্ষ্য",
    "about.missionText":
      "প্রতিটি রিয়েল এস্টেট ব্যবসাকে, পাঁচজনের এজেন্সি থেকে শুরু করে মাল্টি-ব্রাঞ্চ ডেভেলপার পর্যন্ত, একই স্তরের কার্যক্রম স্বচ্ছতা দেওয়া যা আগে শুধু সবচেয়ে বড় প্রতিষ্ঠানগুলোর কাছে ছিল।",
    "about.valuesTitle": "আমরা যা বিশ্বাস করি",
    "about.value1.title": "অপারেটরদের জন্য তৈরি",
    "about.value1.description":
      "প্রতিটি ফিচার তৈরি হয়েছে যিনি প্রতিদিন এটি ব্যবহার করেন তার কথা মাথায় রেখে, শুধু যিনি সফটওয়্যারটি কেনেন তার জন্য নয়।",
    "about.value2.title": "লুকানো জটিলতা নেই",
    "about.value2.description":
      "শক্তিশালী হওয়ার মানে জটিল হওয়া নয়। সাইন আপের একদিনের মধ্যেই টিমের উৎপাদনশীল হওয়া উচিত।",
    "about.value3.title": "ডেটা আপনার থাকে",
    "about.value3.description":
      "যেকোনো সময় যেকোনো কিছু এক্সপোর্ট করুন। আমরা প্রতিটি নবায়নে আপনার ব্যবসা অর্জন করি, লক-ইনের মাধ্যমে নয়।",

    "contact.eyebrow": "যোগাযোগ করুন",
    "contact.title": "আপনার ব্যবসা নিয়ে কথা বলি",
    "contact.description":
      "প্ল্যান নিয়ে প্রশ্ন, ফিচার রিকোয়েস্ট, বা লাইভ ওয়াকথ্রু চান? আমাদের একটি বার্তা পাঠান, আমরা এক কার্যদিবসের মধ্যে ফিরে আসব।",
    "contact.addressLabel": "অফিস",
    "contact.address": "লেভেল ৬, গুলশান অ্যাভিনিউ, ঢাকা ১২১২, বাংলাদেশ",
    "contact.emailLabel": "ইমেল",
    "contact.email": "hello@realbiz.example",
    "contact.phoneLabel": "ফোন",
    "contact.phone": "+৮৮০ ১XXX-XXXXXX",
    "contact.form.name": "পূর্ণ নাম",
    "contact.form.email": "ইমেল ঠিকানা",
    "contact.form.company": "কোম্পানির নাম",
    "contact.form.message": "আমরা কীভাবে সাহায্য করতে পারি?",
    "contact.form.submit": "বার্তা পাঠান",

    "modules.eyebrow": "মডিউলসমূহ",
    "modules.title": "সম্পূর্ণ মডিউল সমূহ",
    "modules.subtitle":
      "কনস্ট্রাকশন ও রিয়েল এস্টেট ব্যবসার জন্য সম্পূর্ণ ইআরপি মডিউল",
    "modules.showMore": "আরও দেখুন",
    "modules.showLess": "কম দেখান",

    "modules.landAcquisition.title": "জমি অধিগ্রহণ সিআরএম",
    "modules.landAcquisition.tagline": "জমি অধিগ্রহণ ও পেমেন্ট ব্যবস্থাপনা",
    "modules.landAcquisition.bullet1": "জমি সংক্রান্ত পেমেন্ট ট্র্যাকিং",
    "modules.landAcquisition.bullet2": "কিস্তির সময়সূচী নির্ধারণ",
    "modules.landAcquisition.bullet3": "লাভ/ক্ষতির বিশ্লেষণ",
    "modules.landAcquisition.bullet4": "খরচের খতিয়ান ব্যবস্থাপনা",

    "modules.projectManagement.title": "প্রজেক্ট ম্যানেজমেন্ট",
    "modules.projectManagement.tagline":
      "প্রজেক্টের অগ্রগতি ও মালামাল ট্র্যাকিং",
    "modules.projectManagement.bullet1": "কাজের সময়সূচী",
    "modules.projectManagement.bullet2": "বাজেট ব্যবস্থাপনা",
    "modules.projectManagement.bullet3": "মালামাল ব্যবহারের ট্র্যাকিং",
    "modules.projectManagement.bullet4": "অগ্রগতির ড্যাশবোর্ড",

    "modules.crm.title": "সিআরএম",
    "modules.crm.tagline": "বিক্রয়, প্রপার্টি তালিকা ও গ্রাহক সিআরএম",
    "modules.crm.bullet1": "লিড ও সুযোগ ব্যবস্থাপনা",
    "modules.crm.bullet2": "ক্লায়েন্ট যোগাযোগ ও ফলো-আপ",
    "modules.crm.bullet3": "প্রপার্টি লিস্টিং ও বুকিং",
    "modules.crm.bullet4": "সেলস পাইপলাইন ট্র্যাকিং",

    "modules.salesCustomer.title": "বিক্রয় ও গ্রাহক",
    "modules.salesCustomer.tagline": "বিক্রয়, প্রপার্টি তালিকা ও গ্রাহক সিআরএম",
    "modules.salesCustomer.bullet1": "লিড ব্যবস্থাপনা",
    "modules.salesCustomer.bullet2": "ক্লায়েন্ট যোগাযোগের লগসমূহ",
    "modules.salesCustomer.bullet3": "প্রপার্টি বুকিং",
    "modules.salesCustomer.bullet4": "বিক্রয় চুক্তিপত্র",

    "modules.creditRealization.title": "ক্রেডিট আদায় / কালেকশন (CR)",
    "modules.creditRealization.tagline": "ঋণ ও কালেকশন ব্যবস্থাপনা",
    "modules.creditRealization.bullet1": "কাস্টমার ক্রেডিট ট্র্যাকিং",
    "modules.creditRealization.bullet2": "অটোমেটেড কালেকশন প্রক্রিয়া",
    "modules.creditRealization.bullet3": "বকেয়া তারিখের সতর্কবার্তা",
    "modules.creditRealization.bullet4": "লাভ/ক্ষতির রিপোর্ট",

    "modules.materialsProcurement.title": "মালামাল ও সংগ্রহ",
    "modules.materialsProcurement.tagline": "মালামাল ও ক্রয় ট্র্যাকিং",
    "modules.materialsProcurement.bullet1": "মালামালের রিকুয়েস্ট",
    "modules.materialsProcurement.bullet2": "কেনাকাটার অনুমোদন",
    "modules.materialsProcurement.bullet3": "ব্যবহারের বিবরণ",
    "modules.materialsProcurement.bullet4": "পুনরায় স্টক অর্ডারের সতর্কতা",

    "modules.accountsFinance.title": "অ্যাকাউন্টস ও ফাইন্যান্স",
    "modules.accountsFinance.tagline": "আর্থিক ব্যবস্থাপনা",
    "modules.accountsFinance.bullet1": "ইনভয়েস অটোমেশন",
    "modules.accountsFinance.bullet2": "খরচ ব্যবস্থাপনা",
    "modules.accountsFinance.bullet3": "কিস্তি ট্র্যাকিং",
    "modules.accountsFinance.bullet4": "আর্থিক প্রতিবেদন",

    "modules.hrPayroll.title": "এইচআর ও পেরোল",
    "modules.hrPayroll.tagline": "মানবসম্পদ ও বেতন ব্যবস্থাপনা",
    "modules.hrPayroll.bullet1": "উপস্থিতি ও ছুটি",
    "modules.hrPayroll.bullet2": "বেতন ও বোনাস",
    "modules.hrPayroll.bullet3": "অগ্রিম ও ওভারটাইম",
    "modules.hrPayroll.bullet4": "স্বয়ংক্রিয় পেরোল সিস্টেম",

    "modules.inventory.title": "ইনভেন্টরি",
    "modules.inventory.tagline": "ইনভেন্টরি ও স্টক ব্যবস্থাপনা",
    "modules.inventory.bullet1": "স্টক ব্যবস্থাপনা",
    "modules.inventory.bullet2": "ইনভেন্টরি রিপোর্ট",
    "modules.inventory.bullet3": "কম স্টকের সতর্কবার্তা",
    "modules.inventory.bullet4": "আইটেম ট্র্যাকিং",

    "modules.purchaseVendor.title": "ক্রয় ও সরবরাহকারী",
    "modules.purchaseVendor.tagline": "মালামাল ক্রয় ও সরবরাহকারী ব্যবস্থাপনা",
    "modules.purchaseVendor.bullet1": "ক্রয়ের অনুরোধ",
    "modules.purchaseVendor.bullet2": "ভেন্ডর বিল পরিশোধ",
    "modules.purchaseVendor.bullet3": "স্টক সতর্কবার্তা",
    "modules.purchaseVendor.bullet4": "পার্থক্য বিশ্লেষণ",

    "modules.customerService.title": "গ্রাহক সেবা / বিক্রয়োত্তর সেবা",
    "modules.customerService.tagline": "ক্লায়েন্ট সাপোর্ট ও সেবা",
    "modules.customerService.bullet1": "ক্লায়েন্টের সমস্যা ট্র্যাকিং",
    "modules.customerService.bullet2": "ফিডব্যাক ব্যবস্থাপনা",
    "modules.customerService.bullet3": "ফলো-আপ নোটিফিকেশন",
    "modules.customerService.bullet4": "সার্ভিস রিপোর্ট",

    "modules.reportsAnalytics.title": "রিপোর্ট ও অ্যানালিটিক্স",
    "modules.reportsAnalytics.tagline": "ব্যবসায়িক ড্যাশবোর্ড ও রিপোর্টসমূহ",
    "modules.reportsAnalytics.bullet1": "আর্থিক বিবরণী",
    "modules.reportsAnalytics.bullet2": "খরচ বিশ্লেষণ",
    "modules.reportsAnalytics.bullet3": "ক্যাশ ফ্লো রিপোর্ট",
    "modules.reportsAnalytics.bullet4": "প্রজেক্টভিত্তিক লাভের রিপোর্ট",

    "modules.boq.title": "বিওকিউ (BOQ)",
    "modules.boq.tagline": "পরিমাণের বিবরণ ও প্রজেক্ট নথি",
    "modules.boq.bullet1": "বিস্তারিত বিওকিউ তৈরি",
    "modules.boq.bullet2": "মালামাল ও খরচের অনুমান",
    "modules.boq.bullet3": "ভার্সন কন্ট্রোল ও ডকুমেন্টের হিস্ট্রি",
    "modules.boq.bullet4": "নিরাপদ সংরক্ষণ ও শেয়ারিং",

    "modules.settingsSecurity.title": "সেটিংস ও সিকিউরিটি",
    "modules.settingsSecurity.tagline": "সিস্টেম সেটআপ ও অ্যাক্সেস কন্ট্রোল",
    "modules.settingsSecurity.bullet1": "ইউজার রোল ব্যবস্থাপনা",
    "modules.settingsSecurity.bullet2": "ডেটা ব্যাকআপ ও নিরাপত্তা",
    "modules.settingsSecurity.bullet3": "মডিউল কাস্টমাইজেশন",
    "modules.settingsSecurity.bullet4": "অডিট লগসমূহ",

    "modules.documentManagement.title": "ডকুমেন্ট ম্যানেজমেন্ট",
    "modules.documentManagement.tagline": "ফাইল ও নথিপত্র ব্যবস্থাপনা",
    "modules.documentManagement.bullet1": "কেন্দ্রীয় তথ্য সংরক্ষণাগার",
    "modules.documentManagement.bullet2": "ভার্সন কন্ট্রোল",
    "modules.documentManagement.bullet3": "নিরাপদ শেয়ারিং",
    "modules.documentManagement.bullet4": "সহজে তথ্য পুনরুদ্ধার",

    "whyRealBiz.eyebrow": "ফিচারসমূহ",
    "whyRealBiz.title": "কেন RealBiz?",
    "whyRealBiz.subtitle":
      "আধুনিক কনস্ট্রাকশন ও রিয়েল এস্টেট ব্যবস্থাপনার জন্য বিশেষ সমাধান",

    "whyRealBiz.accountsFinance.title": "অ্যাকাউন্টস, কিস্তি ও ফাইন্যান্স",
    "whyRealBiz.accountsFinance.desc":
      "কিস্তি, ইনভয়েস, রিসিভট, পেমেন্ট, লেজার ও ব্যালান্স শিট অটোমেটিক ও নিখুঁতভাবে পরিচালনা করা যাবে।",

    "whyRealBiz.purchaseVendor.title": "পারচেজ ও ভেন্ডর ম্যানেজমেন্ট",
    "whyRealBiz.purchaseVendor.desc":
      "কোন পণ্য কখন লাগবে, কত দাম হলো, কার থেকে আনলেন—সব কিছু সিস্টেমে ট্র্যাক করা থাকবে।",

    "whyRealBiz.salesCrm.title": "সেলস, প্রপার্টি লিস্টিং ও CRM",
    "whyRealBiz.salesCrm.desc":
      "লিড আসা থেকে চুক্তি পর্যন্ত সব কিছু এক জায়গায়। আর হারাবেন না কোনো লিড।",

    "whyRealBiz.projectTracking.title":
      "প্রজেক্ট প্রগ্রেস ও মাল্টিরিয়াল ট্র্যাকিং",
    "whyRealBiz.projectTracking.desc":
      "প্রজেক্ট সিডিউল, কস্টিং, মালামাল ব্যবহারের হিসাব ও সাইট প্রগ্রেস রিয়েল-টাইমে দেখা যাবে।",

    "whyRealBiz.hrPayroll.title": "এইচআর ও পেরোল ম্যানেজমেন্ট",
    "whyRealBiz.hrPayroll.desc":
      "স্টাফ অ্যাটেনডেন্স, ছুটি, বেতন, অগ্রিম ও ওভারটাইম সব কিছু অটোমেটেড পেরোল সিস্টেমে।",

    "whyRealBiz.autoReminders.title": "অটো রিমাইন্ডার ও ফলো-আপ",
    "whyRealBiz.autoReminders.desc":
      "ক্লায়েন্ট পেমেন্ট, মিটিং বা কন্ট্রাক্ট আপডেট SMS/Email-এ অটোমেটিক যাবে।",

    "whyRealBiz.dashboardReports.title": "ড্যাশবোর্ড ও রিপোর্ট",
    "whyRealBiz.dashboardReports.desc":
      "এক ক্লিকে লাভ-ক্ষতি, কস্ট ব্রেকডাউন, ক্যাশফ্লো ও সেলস রিপোর্ট দেখা যাবে।",

    "whyRealBiz.anytimeAccess.title": "যেকোনো সময়, যেকোনো জায়গা থেকে অ্যাক্সেস",
    "whyRealBiz.anytimeAccess.desc":
      "অফিস, সাইট, বাসা বা ভ্রমণে—মোবাইল বা ল্যাপটপে লগইন করলেই পুরো সিস্টেম হাতের মুঠোয়।",

    "solutions.construction.eyebrow": "কনস্ট্রাকশন ও রিয়েল এস্টেট",

    "solutions.construction.title": "কনস্ট্রাকশন ও রিয়েল এস্টেট",

    "solutions.construction.subtitle": "সম্পূর্ণ ডিজিটাল সমাধান",

    "solutions.construction.modules": "ERP • CRM • HR",

    "solutions.construction.brand": "RealBiz ERP",

    "solutions.construction.description":
      "- ল্যান্ড অ্যাকুইজিশন CRM, প্রজেক্ট ম্যানেজমেন্ট, CRM, সেলস ম্যানেজমেন্ট, ক্রেডিট রিয়েলাইজেশন/কালেকশন (CR), ম্যাটেরিয়ালস ও প্রকিউরমেন্ট, অ্যাকাউন্টস, HR ও পেরোল, ইনভেন্টরি, কাস্টমার সার্ভিস/আফটার-সেলস — সবকিছু এক প্ল্যাটফর্মে।",

    "solutions.construction.demoButton": "ডেমো নিন",

    "solutions.construction.learnMoreButton": "বিস্তারিত জানুন",

    // Process
    "solutions.process.01.title": "ল্যান্ড অ্যাকুইজিশন",

    "solutions.process.01.subtitle": "CRM",

    "solutions.process.02.title": "প্রজেক্ট ম্যানেজমেন্ট",

    "solutions.process.03.title": "CRM",

    "solutions.process.04.title": "সেলস ম্যানেজমেন্ট",

    "solutions.process.05.title": "ক্রেডিট রিয়েলাইজেশন /",

    "solutions.process.05.subtitle": "কালেকশন (CR)",

    "solutions.process.06.title": "ম্যাটেরিয়ালস ও প্রকিউরমেন্ট",

    "solutions.process.07.title": "অ্যাকাউন্টস",

    "solutions.process.08.title": "HR ও পেরোল",

    "solutions.process.09.title": "ইনভেন্টরি",

    "solutions.process.10.title": "কাস্টমার সার্ভিস /",

    "solutions.process.10.subtitle": "আফটার-সেলস",
    "solutions.eyebrow": "সমাধানসমূহ",
    "solutions.title":
      "আপনি কি রিয়েল এস্টেট, নির্মাণ বা ডেভেলপমেন্ট ব্যবসার সাথে যুক্ত?",
    "solutions.subtitle":
      "আজই ম্যানুয়াল কাজকে বিদায় জানান এবং আপনার ব্যবসাকে করুন স্মার্ট ও সুসংগঠিত।",

    "solutions.accountsFinance.title": "১. হিসাব, কিস্তি ও আর্থিক ব্যবস্থাপনা",
    "solutions.accountsFinance.desc":
      "কিস্তি, ইনভয়েস, রসিদ, পেমেন্ট, লেজার এবং ব্যালেন্স শিট—সবকিছু স্বয়ংক্রিয়ভাবে ও নির্ভুলভাবে পরিচালনা করুন।",

    "solutions.purchaseVendor.title": "২. ক্রয় ও ভেন্ডর ব্যবস্থাপনা",
    "solutions.purchaseVendor.desc":
      "কোন উপকরণ প্রয়োজন, কখন প্রয়োজন, মোট খরচ কত এবং সরবরাহকারীর বিস্তারিত—সবকিছু এক সিস্টেমে সহজেই ট্র্যাক করুন।",

    "solutions.salesCrm.title":
      "৩. বিক্রয়, প্রপার্টি লিস্টিং ও ক্লায়েন্ট CRM",
    "solutions.salesCrm.desc":
      "নতুন লিড আসা থেকে শুরু করে চুক্তি সম্পন্ন হওয়া পর্যন্ত সবকিছু এক জায়গায় পরিচালনা করুন। কোনো লিড আর হারিয়ে যাবে না।",

    "solutions.projectTracking.title": "৪. প্রজেক্ট অগ্রগতি ও উপকরণ ট্র্যাকিং",
    "solutions.projectTracking.desc":
      "প্রজেক্টের সময়সূচি, খরচ, উপকরণ ব্যবহারের রেকর্ড এবং সাইটের অগ্রগতি রিয়েল-টাইমে পর্যবেক্ষণ করুন।",

    "solutions.hrPayroll.title": "৫. HR ও Payroll ব্যবস্থাপনা",
    "solutions.hrPayroll.desc":
      "উপস্থিতি, ছুটি, বেতন, অগ্রিম এবং ওভারটাইম—সবকিছু একটি Payroll সিস্টেমের মাধ্যমে স্বয়ংক্রিয়ভাবে পরিচালনা করুন।",

    "solutions.autoReminders.title":
      "৬. স্বয়ংক্রিয় রিমাইন্ডার ও ফলো-আপ সিস্টেম",
    "solutions.autoReminders.desc":
      "ক্লায়েন্টের পেমেন্ট, মিটিং বা চুক্তির গুরুত্বপূর্ণ সময়সীমা সম্পর্কে স্বয়ংক্রিয় SMS/Email আপডেট পাঠান।",

    "solutions.dashboardReports.title": "৭. ব্যবসায়িক ড্যাশবোর্ড ও রিপোর্ট",
    "solutions.dashboardReports.desc":
      "এক ক্লিকেই Profit & Loss, খরচের বিস্তারিত, Cash Flow এবং Sales Report দেখুন।",

    "solutions.anytimeAccess.title":
      "৮. যেকোনো সময়, যেকোনো স্থান থেকে অ্যাক্সেস",
    "solutions.anytimeAccess.desc":
      "অফিস, সাইট, বাসা বা ভ্রমণে থাকা অবস্থায়—মোবাইল বা ল্যাপটপ থেকে আপনার পুরো সিস্টেমে অ্যাক্সেস করুন।",

    "solutions.documentManagement.title": "৯. ডকুমেন্ট ব্যবস্থাপনা",
    "solutions.documentManagement.desc":
      "চুক্তিপত্র, রিপোর্ট এবং অন্যান্য গুরুত্বপূর্ণ ডকুমেন্ট একটি নিরাপদ স্থানে সংরক্ষণ করুন এবং সহজেই অ্যাক্সেস করুন।",
    "storyline.title": "গল্পের",
    "storyline.legacy": "রিয়েলবিজ প্রো",

    "storyline.description":
      "RealBiz Pro উদ্ভাবন, প্রযুক্তি এবং স্মার্ট সমাধানের সমন্বয়ে ব্যবসা পরিচালনার পদ্ধতিকে নতুনভাবে সংজ্ঞায়িত করছে। দক্ষতা, স্বচ্ছতা এবং টেকসই প্রবৃদ্ধির লক্ষ্য নিয়ে আমরা এমন সমাধান তৈরি করছি, যা ব্যবসাকে আরও সহজ, স্মার্ট এবং সংযুক্ত করে।",

    "storyline.content":
      "RealBiz Pro আধুনিক ডিজিটাল সমাধান, বুদ্ধিমান ম্যানেজমেন্ট টুল এবং সহজ কার্যপ্রবাহের মাধ্যমে ব্যবসাকে আরও শক্তিশালী করার জন্য তৈরি। অপারেশন, ফাইন্যান্স, রিয়েল এস্টেট থেকে শুরু করে ব্যবসা ব্যবস্থাপনার প্রতিটি অংশকে এক প্ল্যাটফর্মে সংযুক্ত করে RealBiz Pro আপনার ব্যবসাকে আরও স্মার্ট ভবিষ্যতের দিকে এগিয়ে নিতে সাহায্য করে।",
    "buyer.title": "ক্রেতা হিসেবে যোগ দিন",
    "buyer.description":
      "আত্মবিশ্বাসের সাথে আপনার স্বপ্নের সম্পত্তিতে প্রবেশ করুন। আপনার জীবনধারা এবং ভবিষ্যতের আকাঙ্ক্ষার সাথে মিল রেখে তৈরি ব্যতিক্রমী আবাসিক এবং বাণিজ্যিক স্থানগুলির আমাদের বিশেষ সংগ্রহ আবিষ্কার করুন।",
    "buyer.card1.title": "প্রধান অবস্থানসমূহ",
    "buyer.card1.desc":
      "আপনার স্বাচ্ছন্দ্যের জন্য তৈরি সবচেয়ে জনপ্রিয় এলাকাগুলিতে অবস্থিত হস্তশিল্পের আবাসিক স্থানগুলি অন্বেষণ করুন।",
    "buyer.card2.title": "এক্সক্লুসিভ হোম",
    "buyer.card2.desc":
      "আপনার দৈনন্দিন জীবনযাত্রার মান উন্নত করার জন্য নির্মিত মার্জিত স্থাপত্য এবং সমসাময়িক ডিজাইনগুলি উন্মচন করুন।",
    "services.hero.eyebrow": "সম্পূর্ণ রিয়েল এস্টেট ইআরপি",
    "services.hero.title": "আমাদের সেবাসমূহ ও সক্ষমতা",
    "services.hero.subtitle":
      "জানুন কীভাবে আমাদের বিশেষায়িত মডিউলগুলো জমি অধিগ্রহণ, নির্মাণ ব্যবস্থাপনা, গ্রাহক সেবা এবং আর্থিক নিয়ন্ত্রণকে সহজ করে।",

    "services.landAcquisition.title": "১. জমি অধিগ্রহণ ও প্লটিং",
    "services.landAcquisition.desc":
      "জমি সোর্সিং, ভূমিমালিকের চুক্তি, আইনি কাগজপত্র এবং স্বয়ংক্রিয় প্লট বরাদ্দ পরিচালনা করুন একটি সমন্বিত সিস্টেমে।",
    "services.landAcquisition.feat1": "প্লট ম্যাপিং ও ট্র্যাকিং",
    "services.landAcquisition.feat2": "চুক্তি ও দলিলের ইতিহাস",
    "services.landAcquisition.feat3": "জমির মালিকের পেমেন্ট সময়সূচী",
    "services.landAcquisition.feat4": "ডকুমেন্ট অনুমোদন পাইপলাইন",

    "services.projectManagement.title": "২. নির্মাণ ও সাইট অপারেশনস",
    "services.projectManagement.desc":
      "প্রকল্পের মাইলফলক, সাইটে মালামালের ব্যবহার, ঠিকাদারের বিল এবং দৈনিক কাজের অগ্রগতি ট্র্যাকিং করুন বাস্তব সময়ে।",
    "services.projectManagement.feat1": "মাইলফলক ও সময়সূচী ট্র্যাকিং",
    "services.projectManagement.feat2": "ঠিকাদারের পরিমাপ শীট",
    "services.projectManagement.feat3": "মালামাল রিকুইজিশন লগ",
    "services.projectManagement.feat4": "সাইটের কাজের অগ্রগতি ফটো ও অডিট",

    "services.crmSales.title": "৩. সেলস, লিড ও সিআরএম",
    "services.crmSales.desc":
      "গ্রাহক রূপান্তর ত্বরান্বিত করুন, অনুসন্ধান থেকে বুকিং পর্যন্ত ট্র্যাকিং করুন এবং স্বয়ংক্রিয় ফলো-আপ পরিচালনা করুন।",
    "services.crmSales.feat1": "মাল্টি-চ্যানেল লিড সংগ্রহ",
    "services.crmSales.feat2": "স্বয়ংক্রিয় সেলস পাইপলাইন",
    "services.crmSales.feat3": "ইউনিট বুকিং ও হোল্ড স্ট্যাটাস",
    "services.crmSales.feat4": "গ্রাহকের যোগাযোগের ইতিহাস",

    "services.financeAccounts.title": "৪. আর্থিক নিয়ন্ত্রণ ও হিসাবরক্ষণ",
    "services.financeAccounts.desc":
      "প্রজেক্ট বাজেট, গ্রাহকের কিস্তি, লেজার এন্ট্রি, ট্যাক্স হিসাব এবং আর্থিক পূর্বাভাসের সম্পূর্ণ নিয়ন্ত্রণ বজায় রাখুন।",
    "services.financeAccounts.feat1": "রিয়েল-টাইম লেজার আপডেট",
    "services.financeAccounts.feat2": "কিস্তি ও জরিমানা অটোমেশন",
    "services.financeAccounts.feat3": "প্রজেক্ট খরচ হিসাবরক্ষণ",
    "services.financeAccounts.feat4": "মাল্টি-ব্যাংক রিকনসিলিয়েশন",

    "services.materialsInventory.title": "৫. মালামাল, গুদাম ও সংগ্রোহ",
    "services.materialsInventory.desc":
      "কঠোর ইনভেন্টরি নিয়ন্ত্রণ, ভেন্ডর পারচেজ অর্ডার, গুদাম স্টক মুভমেন্ট এবং গেট-পাস ট্র্যাকিংয়ের মাধ্যমে অপচয় রোধ করুন।",
    "services.materialsInventory.feat1": "স্টক লেভেল অ্যালার্ট ও সুরক্ষা সীমা",
    "services.materialsInventory.feat2": "ভেন্ডর পারচেজ অর্ডার ওয়ার্কফ্লো",
    "services.materialsInventory.feat3": "সাইট-টু-সাইট ট্রান্সফার লগ",
    "services.materialsInventory.feat4": "গেট-পাস ও ডেলিভারি যাচাইকরণ",

    "services.analyticsReporting.title":
      "৬. বিজনেস ইন্টেলিজেন্স ও অ্যানালিটিক্স",
    "services.analyticsReporting.desc":
      "ইন্টারেক্টিভ ড্যাশবোর্ড, কাস্টম আর্থিক রিপোর্ট এবং প্রজেক্টের পারফরম্যান্স বিশ্লেষণ করে সঠিক ব্যবসায়িক সিদ্ধান্ত নিন।",
    "services.analyticsReporting.feat1": "ইন্টারেক্টিভ এক্সিকিউটিভ ড্যাশবোর্ড",
    "services.analyticsReporting.feat2": "কাস্টম রিপোর্ট জেনারেটর",
    "services.analyticsReporting.feat3": "প্রজেক্ট আরওআই ও মার্জিন বিশ্লেষণ",
    "services.analyticsReporting.feat4": "পিডিএফ/এক্সেল এক্সপোর্ট সুবিধা",
  },
};

const LANGUAGE_KEY = "realbiz-language";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tArray: (key: string) => FeatureItem[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  tArray: () => [],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    if (stored === "bn" || stored === "en") {
      setLanguageState(stored);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = (key: string): string => {
    if (!mounted) return key;
    const value = translations[language][key] || translations.en[key] || key;
    return typeof value === "string" ? value : key;
  };

  const tArray = (key: string): FeatureItem[] => {
    if (!mounted) return [];
    const value = translations[language][key] || translations.en[key] || [];
    return Array.isArray(value) ? value : [];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

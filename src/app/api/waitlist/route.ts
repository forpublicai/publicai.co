import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const product = typeof body.product === "string" ? body.product.trim() : "general";
    const organization =
      typeof body.organization === "string" ? body.organization.trim() : "";
    const useCase = typeof body.useCase === "string" ? body.useCase.trim() : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    console.info("[Waitlist Signup]", {
      email,
      product,
      organization,
      useCase,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      message: "You have been added to the early access waitlist.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to process waitlist request." },
      { status: 500 }
    );
  }
}

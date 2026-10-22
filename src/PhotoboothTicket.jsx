
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

export default function PhotoboothTicket() {
  const ticketRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const registration = state.registration || {};
  const ticket = state.ticket || {};

  const name = registration.name || ticket.registration?.name || "Guest";
  const phone =
    registration.Phone ||
    registration.phone ||
    ticket.registration?.Phone ||
    ticket.registration?.phone ||
    "";

  const serialNumber =
    ticket.serialNumber ??
    registration.serialNumber ??
    ticket.registration?.serialNumber ??
    "";

  const alreadyRegistered = Boolean(state.alreadyRegistered);
  const serial = serialNumber !== "" ? String(serialNumber).padStart(3, "0") : "";

  const handleDownload = async () => {
    if (!ticketRef.current || downloading) return;

    try {
      setDownloading(true);

      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        backgroundColor: "#fbf8f2",
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `Cityvibes-Ticket-${serial || "Registration"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Ticket download failed:", error);
      alert("Ticket download nahi ho paya. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Never display a fake serial number if the backend response is missing.
  if (!serial) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f2ec] px-5">
        <section className="w-full max-w-md border border-[#e9e2d6] bg-white p-7 text-center">
          <h1 className="font-serif text-2xl text-[#211f1b]">
            Ticket details unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#777168]">
            Ticket serial number nahi mila. Please registration dobara check
            karein.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full bg-[#211f1b] px-5 py-4 text-sm font-semibold text-white"
          >
            Back to Registration
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f2ec] px-4 py-6 sm:flex sm:items-center sm:justify-center sm:py-10">
      <section className="mx-auto w-full max-w-md overflow-hidden border border-[#e9e2d6] bg-white shadow-[0_12px_45px_-25px_rgba(40,32,20,0.25)]">
        <header className="border-b border-[#eee8de] px-6 pb-5 pt-7 text-center">
          <div className="text-[29px] font-semibold tracking-[-1.4px] text-[#171613]">
            CITYVIBES
          </div>

          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-7 bg-[#b49a6a]" />
            <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#8a795e]">
              Registration
            </p>
            <span className="h-px w-7 bg-[#b49a6a]" />
          </div>
        </header>

        <div className="px-5 pb-7 pt-7 sm:px-7">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#d9c8a8] bg-[#faf7f0] text-xl text-[#927444]">
              ✓
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a8055]">
              {alreadyRegistered ? "Existing Registration Found" : "Registration Complete"}
            </p>

            <h1 className="mt-2 font-serif text-[29px] leading-tight tracking-[-0.8px] text-[#211f1b]">
              {alreadyRegistered ? "Welcome back!" : "You’re all set!"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#777168]">
              {alreadyRegistered
                ? "Your previously allotted Cityvibes ticket is shown below."
                : "Your Cityvibes Photobooth ticket is ready."}
            </p>
          </div>

          <div
            ref={ticketRef}
            className="mt-7 overflow-hidden rounded-xl border border-[#dfcfb2] bg-[#fbf8f2]"
          >
            <div className="border-b border-dashed border-[#cdb993] px-4 py-5 text-center">
              <p className="font-serif text-xl font-semibold tracking-[0.1em] text-[#211f1b]">
                CITYVIBES
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.25em] text-[#927444]">
                Photobooth Ticket
              </p>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#928574]">
                  Registered Guest
                </p>
                <p className="mt-1 break-words font-serif text-xl text-[#211f1b]">
                  {name}
                </p>
              </div>

              <div className="border-t border-[#e8ddc9] pt-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#928574]">
                  Mobile Number
                </p>
                <p className="mt-1 break-all text-sm font-medium text-[#292724]">
                  {phone || "Not provided"}
                </p>
              </div>

              <div className="border-t border-[#e8ddc9] pt-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#928574]">
                  Your Ticket Serial Number
                </p>

                <p className="mt-2 break-all font-serif text-6xl font-semibold tracking-[0.12em] text-[#927444]">
                  {serial}
                </p>

                <p className="mt-2 text-[10px] text-[#898276]">
                  Keep this number for reference
                </p>
              </div>

              <div className="border-t border-dashed border-[#cdb993] pt-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#76674f]">
                  Explore more about Cityvibes
                </p>
                <p className="mt-1 text-xs text-[#898276]">cityvibes.in</p>
              </div>
            </div>

            <div className="bg-[#211f1b] px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#e6d5b7]">
                Your Cityvibes Moment
              </p>
            </div>
          </div>

          <button
            type="button" 
            onClick={handleDownload}
            disabled={downloading}
            className="mt-6 flex w-full items-center justify-center gap-3 bg-[#211f1b] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#39342b] disabled:opacity-60"
          >
            {downloading ? "Preparing ticket..." : "↓ Download Ticket"}
          </button>

          <p className="mt-4 text-center text-[11px] leading-5 text-[#989084]">
            Save your ticket and keep your serial number handy.
          </p>
        </div>
      </section>
    </main>
  );
}

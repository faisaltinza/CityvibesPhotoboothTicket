
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "./appwrite/auth.js";

const professions = [
  "Student",
  "Business Owner",
  "Working Professional",
  "Self-employed",
  "Freelancer",
  "Homemaker",
  "Other",
];

const initialForm = {
  name: "",
  phone: "",
  profession: "",
  knowsCityvibes: "",
};

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    const cleanName = form.name.trim();

    if (!cleanName) {
      nextErrors.name = "Please enter your full name.";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      nextErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (!form.profession) {
      nextErrors.profession = "Please select your profession.";
    }

    if (!form.knowsCityvibes) {
      nextErrors.knowsCityvibes = "Please select an option.";
    }

    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);

    try {
      const fullPhone = `+91${form.phone}`;

      // Backend checks for an existing registration and either
      // returns its ticket or creates a new registration.
      const result = await authService.saveRegistration({
        name: cleanName,
        phone: fullPhone,
        profession: form.profession,
        knowsCityvibes: form.knowsCityvibes,
      });

      if (result?.ok === false) {
        throw new Error(
          result.error || "Registration could not be completed."
        );
      }

      const registration = result?.registration || result;

      const serialNumber =
        result?.serialNumber ?? registration?.serialNumber;

      if (!serialNumber) {
        throw new Error(
          "Registration response did not contain a ticket serial number."
        );
      }

      navigate("/ticket", {
        state: {
          ticket: {
            ...result,
            serialNumber,
          },
          registration: {
            ...registration,
            serialNumber,
          },
          alreadyRegistered: Boolean(result?.alreadyRegistered),
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage(
        error?.message ||
          "Unable to complete registration. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const labelClass =
    "mb-2 block text-[13px] font-semibold tracking-wide text-[#292724]";

  const inputClass =
    "w-full rounded-lg border border-[#e4dfd5] bg-white px-4 py-3.5 text-[15px] text-[#25231f] outline-none transition placeholder:text-[#aaa49a] focus:border-[#927444] focus:ring-2 focus:ring-[#927444]/10";

  return (
    <main className="min-h-screen bg-[#f5f2ec] px-4 py-6 sm:flex sm:items-center sm:justify-center sm:py-10">
      <section className="mx-auto w-full max-w-md overflow-hidden border border-[#e9e2d6] bg-white shadow-[0_12px_45px_-25px_rgba(40,32,20,0.25)]">
        <header className="border-b border-[#eee8de] px-6 pb-5 pt-7 text-center">
          <a
            href="https://cityvibes.in/"
            className="inline-block text-[29px] font-semibold tracking-[-1.4px] text-[#171613]"
            aria-label="Cityvibes"
          >
            CITYVIBES
          </a>

          <div className="mx-auto mt-3 flex items-center justify-center gap-2">
            <span className="h-px w-7 bg-[#b49a6a]" />
            <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#8a795e]">
              Registration
            </p>
            <span className="h-px w-7 bg-[#b49a6a]" />
          </div>
        </header>

        <div className="px-5 pb-7 pt-6 sm:px-7 sm:pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a8055]">
            Your Cityvibes Experience
          </p>

          <h1 className="mt-2 font-serif text-[30px] leading-tight tracking-[-0.8px] text-[#211f1b]">
            Let’s get to know you.
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#777168]">
            Enter your details to register and receive your unique ticket
            number.
          </p>

          <div className="mt-2 text-[11px] text-[#938b7e]">
            STEP 01 <span className="mx-1.5">/</span> PERSONAL DETAILS
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            {/* Full name */}
            <div>
              <label htmlFor="name" className={labelClass}>
                Full name <span className="text-[#a66c43]">*</span>
              </label>

              <input
                id="name"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your full name"
                className={inputClass}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />

              {errors.name && (
                <p id="name-error" className="mt-1.5 text-xs text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label htmlFor="phone" className={labelClass}>
                Mobile number <span className="text-[#a66c43]">*</span>
              </label>

              <div className="flex overflow-hidden rounded-lg border border-[#e4dfd5] bg-white focus-within:border-[#927444] focus-within:ring-2 focus-within:ring-[#927444]/10">
                <span className="flex shrink-0 items-center border-r border-[#e9e3d9] px-3.5 text-sm font-medium text-[#39352e]">
                  +91
                </span>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    updateField(
                      "phone",
                      e.target.value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  placeholder="10-digit mobile number"
                  className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-[15px] text-[#25231f] outline-none placeholder:text-[#aaa49a]"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </div>

              {errors.phone ? (
                <p id="phone-error" className="mt-1.5 text-xs text-red-600">
                  {errors.phone}
                </p>
              ) : (
                <p className="mt-2 text-xs text-[#938b7e]">
                  Your ticket will be linked to this mobile number.
                </p>
              )}
            </div>

            {/* Profession */}
            <div>
              <label htmlFor="profession" className={labelClass}>
                What do you do? <span className="text-[#a66c43]">*</span>
              </label>

              <select
                id="profession"
                name="profession"
                value={form.profession}
                onChange={(e) => updateField("profession", e.target.value)}
                className={`${inputClass} appearance-none ${
                  form.profession ? "" : "text-[#aaa49a]"
                }`}
                aria-invalid={!!errors.profession}
              >
                <option value="" disabled>
                  Select your profession
                </option>

                {professions.map((profession) => (
                  <option key={profession} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>

              {errors.profession && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.profession}
                </p>
              )}
            </div>

            {/* Brand awareness */}
            <fieldset>
              <legend className={labelClass}>
                Do you know Cityvibes?
                <span className="text-[#a66c43]"> *</span>
              </legend>

              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "yes",
                    title: "Yes, I do",
                    subtitle: "I know the brand",
                  },
                  {
                    value: "no",
                    title: "Not yet",
                    subtitle: "I'm new here",
                  },
                ].map((option) => {
                  const selected = form.knowsCityvibes === option.value;

                  return (
                    <label
                      key={option.value}
                      className={`flex min-h-[88px] cursor-pointer items-start gap-2.5 rounded-lg border p-3.5 transition ${
                        selected
                          ? "border-[#927444] bg-[#faf7f0]"
                          : "border-[#e7e1d7] bg-white hover:border-[#c8b58f]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="knowsCityvibes"
                        value={option.value}
                        checked={selected}
                        onChange={() =>
                          updateField("knowsCityvibes", option.value)
                        }
                        className="mt-1 h-4 w-4 shrink-0 accent-[#927444]"
                      />

                      <span>
                        <span className="block text-[13px] font-semibold text-[#292724]">
                          {option.title}
                        </span>
                        <span className="mt-1 block text-[11px] leading-4 text-[#898276]">
                          {option.subtitle}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {errors.knowsCityvibes && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.knowsCityvibes}
                </p>
              )}
            </fieldset>

            {/* Status message */}
            {message && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"
              >
                {message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-3 bg-[#211f1b] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#39342b] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#927444]/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Submitting..." : "Get My Ticket"}
              {!isSaving && (
                <span aria-hidden="true" className="text-lg font-normal">
                  →
                </span>
              )}
            </button>

            <p className="text-center text-[11px] leading-5 text-[#989084]">
              By continuing, you agree to provide accurate registration
              details.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

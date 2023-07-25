"use client";
import { useState, useMemo } from "react";
import { countryCode } from "./countryCode";
import { Label } from "./ui/label";

interface InputValue {
  onValueChange: (value: string) => void;
}

export const InputNo = ({ onValueChange }: InputValue) => {
  const [selectedCode, setSelectedCode] = useState("+234");
  const [showCodes, setShowCodes] = useState(false);
  const codes = useMemo(() => countryCode, []);

  return (
    <>
      <fieldset className="flex flex-col min-w-0 mb-6">
        <Label htmlFor="fullname" className="text-sm md:text-base">
          {" "}
          Whatsapp Number
        </Label>
        <div className="relative flex max-w-full gap-2 py-1 pl-3 mt-2 bg-[#ecebf382] border rounded-md cursor-pointer outline-0 border-secondary-darkGray">
          <div
            className="flex items-center my-2 focus:border focus:border-solid w-fit"
            onClick={() => {
              setShowCodes((prev) => !prev);
            }}
          >
            <span
              className={`${
                !selectedCode && "opacity-70"
              } text-sm md:text-base whitespace-nowrap max-w-full`}
            >
              {selectedCode || "+234"}
            </span>
          </div>
          <ul
            className={`rounded-md border bg-popover text-popover-foreground px-3 cursor-pointer flex flex-col gap-3 shadow-md  w-fit max-h-[10rem] overflow-y-scroll absolute left-2 z-50 top-full outline-0 ${
              showCodes ? "h-auto  py-3 " : "h-0"
            } transition-all duration-300 ease-out`}
            onBlur={() => {
              setShowCodes(false);
            }}
            tabIndex={4}
          >
            {codes.map((cod) => (
              <li
                key={cod.name}
                value={cod.code}
                onClick={() => {
                  setSelectedCode(cod.code);
                  setShowCodes(false);
                }}
              >
                {cod.name} {cod.code}
              </li>
            ))}
          </ul>
          <input
            autoComplete={"off"}
            onChange={(e) => {
              onValueChange(`${selectedCode}${e.target.value}`);
            }}
            required
            type="tel"
            id="tel"
            name="tel"
            maxLength={11}
            placeholder="Whatsapp number"
            className="flex-auto w-auto min-w-0 bg-transparent text-sm md:text-base focus-within:outline-none focus-within:cursor-text placeholder:text-ellipsis"
          />
        </div>
      </fieldset>
    </>
  );
};

import React from "react";

type DonationConfirmPopupProps = {
  userName: string;
  donationAmount: string | number;
  onConfirm: (response: string) => void;
};

export const DonationConfirmPopup: React.FC<DonationConfirmPopupProps> = ({
  userName,
  donationAmount,
  onConfirm,
}) => {
  // Format the donation amount if it's a number
  const formattedAmount =
    typeof donationAmount === "number"
      ? `$${donationAmount.toFixed(2)}`
      : donationAmount;

  return (
    <div className="bg-white border border-[#4D2583] rounded-lg shadow-md p-5 mt-3">
      <h3 className="text-[#4D2583] font-bold text-lg mb-4">
        Donation Authorization
      </h3>

      <div className="text-gray-700 text-sm space-y-4">
        <p className="font-medium">
          I, <span className="text-[#4D2583] font-semibold">{userName}</span>,
          authorize 1199SEIU United Healthcare Workers East, to file this
          payroll deduction form on my behalf with my employer to withhold:
        </p>

        <div className="bg-[#F5F0FF] p-3 rounded-md border-l-4 border-[#4D2583] flex flex-col items-center my-4">
          <p className="font-medium text-[#4D2583]">Per Month</p>
          <p className="font-bold text-xl text-[#4D2583]">{formattedAmount}</p>
        </div>

        <p>
          and forward that amount to the 1199 SEIU United Healthcare Workers
          East Federal Political Action Fund, PO Box 2665, New York, NY 10108.
        </p>

        <p className="font-medium mt-4">
          This authorization is made voluntarily based on my specific
          understanding that:
        </p>

        <ol className="list-decimal pl-5 space-y-2">
          <li>
            The signing of this authorization form and the making of these
            voluntary contributions are not conditions of my employment by my
            Employer or membership in my Union;
          </li>
          <li>I may refuse to contribute without any reprisal;</li>
          <li>
            Any guideline amount is merely a suggestion, and I will not be
            favored or disadvantaged because of the amount of my contribution or
            my decision not to contribute; and
          </li>
          <li>
            The 1199 SEIU United Healthcare Workers East Federal Political
            Action Fund uses the money it receives for political purposes,
            including but not limited to, making contributions to and
            expenditures on behalf of candidates for federal, state, local
            offices and addressing political issues of public importance.
          </li>
          <li>
            Contributions to the 1199 SEIU United Healthcare Workers East
            Federal Political Action Fund are not deductible as charitable
            contributions for federal income tax purposes.
          </li>
          <li>
            This authorization shall remain in full force and effect until
            revoked by me either electronically by sending an email to
            PACRevocation@1199.org or in writing to the 1199SEIU Political
            Action Department at PO Box 2665, New York, NY 10108.
          </li>
        </ol>

        <p className="text-xs italic mt-4">
          Federal law requires us to use our best efforts to collect and report
          the name, mailing address, occupation and name of employer of
          individuals whose contributions exceed $200 in a calendar year.
        </p>
      </div>

      <div className="flex gap-3 mt-6 justify-center">
        <button
          onClick={() => onConfirm("Yes, I confirm")}
          className="bg-[#4D2583] text-white px-5 py-2 rounded-full font-medium hover:bg-[#3a1c62] transition-colors shadow-sm hover:shadow active:scale-95"
        >
          Yes, I confirm
        </button>
        <button
          onClick={() => onConfirm("No")}
          className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm hover:shadow active:scale-95"
        >
          No
        </button>
      </div>
    </div>
  );
};

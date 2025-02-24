"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsOfService() {
  const router = useRouter();
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span>Back</span>
      </button>
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
        Terms of Service
      </h1>

      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Terms</h2>
          <p>
            By accessing Todue, you agree to be bound by these terms of
            service and agree that you are responsible for compliance with any
            applicable local laws. If you do not agree with any of these terms,
            you are prohibited from using or accessing Todue.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            2. Use License
          </h2>
          <p>
            Permission is granted to temporarily access Todue for personal
            use. This is the grant of a license, not a transfer
            of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>modify or copy the materials;</li>
            <li>use the materials for any commercial purpose without proper subscription;</li>
            <li>
              attempt to reverse engineer any software contained on Todue;
            </li>
            <li>
              remove any copyright or other proprietary notations from the
              materials;
            </li>
            <li>
              transfer the materials to another person or "mirror" the materials
              on any other server.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            3. Google Calendar Integration
          </h2>
          <p>
            Todue uses Google Calendar API Services to provide functionality. By
            using our service, you are also agreeing to be bound by the{" "}
            <a
              href="https://policies.google.com/terms"
              className="text-indigo-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Terms of Service
            </a>
            . Todue will only access your calendar with your explicit permission to add events extracted from your syllabus documents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            4. User Data and Privacy
          </h2>
          <p>
            Todue processes and stores syllabi that you upload to extract assignment dates and create calendar events. We do not share your syllabi or extracted data with third parties except as necessary to provide our services. For more detailed information, please refer to our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            5. Disclaimer
          </h2>
          <p>
            The materials and services on Todue are provided on an 'as is' basis.
            Todue makes no warranties, expressed or implied, and hereby
            disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            6. Limitations
          </h2>
          <p>
            In no event shall Todue or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use Todue. While we strive for accuracy in our extraction of dates and assignments from syllabi, we cannot guarantee that all information will be extracted correctly, and users should verify important dates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            7. Subscription and Billing
          </h2>
          <p>
            Todue offers both free and premium subscription plans. By subscribing to a premium plan, you agree to pay the applicable fees as described on our pricing page. We reserve the right to change subscription fees upon reasonable notice. Subscription fees are non-refundable except as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            8. Academic Integrity
          </h2>
          <p>
            Todue is designed to help students organize their academic schedules but is not responsible for ensuring users meet their academic obligations. Users remain solely responsible for completing assignments, meeting deadlines, and complying with their academic institution's rules and policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            9. Revisions and Errata
          </h2>
          <p>
            The materials appearing on Todue could include technical,
            typographical, or photographic errors. Todue does not warrant
            that any of the materials on its website are accurate, complete, or
            current. Todue may make changes to the materials contained on
            its website at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Links</h2>
          <p>
            Todue has not reviewed all of the sites linked to its website
            and is not responsible for the contents of any such linked site. The
            inclusion of any link does not imply endorsement by Todue of the
            site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            11. Terms of Use Modifications
          </h2>
          <p>
            Todue may revise these terms of use for its website at any time
            without notice. By using this website you are agreeing to be bound
            by the then current version of these Terms and Conditions of Use.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            12. Account Termination
          </h2>
          <p>
            Todue reserves the right to terminate user accounts for violations of these Terms of Service, including but not limited to: sharing accounts between multiple users, using the service for unauthorized commercial purposes, or any use that places excessive burden on our infrastructure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            13. Governing Law
          </h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section className="pt-6">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>
    </div>
  );
}
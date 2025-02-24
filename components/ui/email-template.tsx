import * as React from "react";

interface EmailTemplateProps {
  fullName: string;
  email: string;
  message: string;
}

export default function EmailTemplate({
  fullName,
  email,
  message,
}: EmailTemplateProps) {
  return (
    <div style={{
      backgroundColor: "#F9FAFB",
      minHeight: "100vh",
      padding: "2rem 1rem",
    }}>
      <div style={{
        maxWidth: "42rem",
        margin: "0 auto",
        backgroundColor: "#FFFFFF",
        borderRadius: "0.5rem",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: "#4F46E5",
          padding: "2rem 1.5rem",
        }}>
          <h1 style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#FFFFFF",
            margin: 0,
          }}>
            New Contact Form Submission
          </h1>
        </div>

        {/* Content */}
        <div style={{
          padding: "1.5rem",
        }}>
          <div style={{
            borderBottom: "1px solid #E5E7EB",
            paddingBottom: "1rem",
            marginBottom: "1.5rem",
          }}>
            <h2 style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: "0.5rem",
            }}>
              Contact Details
            </h2>
            <div style={{
              marginBottom: "0.5rem",
            }}>
              <p style={{
                color: "#4B5563",
                margin: "0 0 0.5rem 0",
              }}>
                <span style={{ fontWeight: "500" }}>Name:</span> {fullName}
              </p>
              <p style={{
                color: "#4B5563",
                margin: 0,
              }}>
                <span style={{ fontWeight: "500" }}>Email:</span>{" "}
                <a
                  href={`mailto:${email}`}
                  style={{
                    color: "#4F46E5",
                    textDecoration: "none",
                  }}
                >
                  {email}
                </a>
              </p>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h2 style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: "0.5rem",
            }}>
              Message Content
            </h2>
            <div style={{
              backgroundColor: "#F9FAFB",
              borderRadius: "0.5rem",
              padding: "1rem",
            }}>
              <p style={{
                color: "#374151",
                whiteSpace: "pre-wrap",
                margin: 0,
              }}>
                {message}
              </p>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid #E5E7EB",
            paddingTop: "1rem",
          }}>
            <p style={{
              fontSize: "0.875rem",
              color: "#6B7280",
              margin: 0,
            }}>
              This message was automatically generated from the Todue contact form.
              Please respond within 24 hours.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: "#F9FAFB",
          padding: "1rem 1.5rem",
          borderTop: "1px solid #E5E7EB",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "0.875rem",
            color: "#4B5563",
          }}>
            <p style={{ margin: "0 0 0.25rem 0" }}>
              © {new Date().getFullYear()} Todue. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
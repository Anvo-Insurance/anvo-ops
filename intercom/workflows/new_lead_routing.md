# Workflow: New Lead Routing

## Purpose

Route inbound leads from Intercom to the correct handler based on lead type, line of business, and urgency.

## Trigger Condition

<!-- TODO: Edward to fill in — What event starts this workflow? -->
<!-- Examples: new conversation created, specific tag applied, message contains certain keywords, form submission -->

| Trigger | Details |
|---------|---------|
| **Event** | <!-- e.g., New conversation created in Intercom --> |
| **Source channels** | <!-- e.g., Website chat widget, email to info@anvo-insurance.com, social media --> |
| **Qualifying criteria** | <!-- What makes this a "lead" vs. a service request? --> |

## Actions

### Step 1: Classify the Lead

Determine lead type based on the initial message content:

| Lead Type | Indicators | Route To |
|-----------|------------|----------|
| New business inquiry | Mentions needing insurance, getting a quote, starting a policy | Alice (initial intake) → Edward (carrier selection) |
| Renewal question | References existing policy, renewal date, premium change | Alice |
| Certificate request | Asks for COI, certificate, additional insured | Alice |
| Claim report | Reports a loss, incident, accident, damage | Alice (log first notice) → Edward (immediate escalation) |
| General question | Doesn't fit above categories | Alice |

### Step 2: Tag and Assign

1. Apply the appropriate Intercom tag: <!-- TODO: Edward to fill in — list tags once Intercom tagging taxonomy is set up -->
2. Assign to Alice in Intercom (she handles first response; escalations go to Edward per the routing table above).
3. If the lead includes a phone number or email, create/update the contact in EZLynx via the webhook integration (see `intercom/setup_notes.md`).

### Step 3: Initial Response

Send the appropriate auto-response template from `intercom/templates/`. Response must go out within:

| Priority | Response Time |
|----------|--------------|
| Claim report | Immediate (auto-reply) + human follow-up within 1 hour |
| New business | Within 15 minutes during business hours |
| Renewal question | Within 1 hour during business hours |
| Certificate request | Within 2 hours during business hours |
| General question | Within 4 hours during business hours |

**Business hours:** Monday–Friday, 8:00 AM – 6:00 PM ET.

## Escalation Rules

| Condition | Escalation Action |
|-----------|-------------------|
| Lead unresponded after SLA window | Notify Edward by email: `[SLA MISS] {client name} — {lead type}` |
| Lead mentions large account (>$50K premium) | Escalate to Edward immediately |
| Lead mentions claim or legal action | Escalate to Edward immediately |
| Lead is from a referral source | Escalate to Edward — referral relationships require personal touch |

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Message is spam or irrelevant | Close the conversation and apply a "spam" tag in Intercom. |
| Message is in a language other than English | Respond in English. If communication is difficult, escalate to Edward. |
| Lead comes in outside business hours | Send auto-reply acknowledgment. Claims or urgent leads trigger a text to Edward. All others processed next business morning. |
| Lead references a specific agent by name | Route to that person. If the name isn't recognized, route to Alice. |
| Duplicate lead (same person, same request) | Merge conversations in Intercom. Do not create duplicate EZLynx records. |

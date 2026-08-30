def calculate_risk(anomaly_score, rule_alerts):
    """
    Combine ML anomaly score and rule violations
    into a 0-100 risk score.
    """

    # -----------------------------
    # 1. ML Risk
    # -----------------------------
    # Isolation Forest:
    # More negative score = more unusual
    if anomaly_score <= -0.10:
        ml_points = 60
    elif anomaly_score <= 0:
        ml_points = 40
    elif anomaly_score <= 0.10:
        ml_points = 20
    else:
        ml_points = 5

    # -----------------------------
    # 2. Rule Risk
    # -----------------------------
    rule_points = 0

    for alert in rule_alerts:
        severity = alert.get("severity", "MEDIUM")

        if severity == "HIGH":
            rule_points += 20
        elif severity == "MEDIUM":
            rule_points += 10
        else:
            rule_points += 5

    # Maximum rule contribution = 40
    rule_points = min(rule_points, 40)

    # -----------------------------
    # 3. Final score
    # -----------------------------
    risk_score = min(ml_points + rule_points, 100)

    # -----------------------------
    # 4. Risk level
    # -----------------------------
    if risk_score >= 80:
        risk_level = "CRITICAL"
    elif risk_score >= 60:
        risk_level = "HIGH"
    elif risk_score >= 30:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
    }
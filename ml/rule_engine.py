def check_rules(work):
    alerts = []

    sanctioned = float(work.get("sanctioned_cost", 0) or 0)
    expenditure = float(work.get("cumulative_expenditure", 0) or 0)
    released = float(work.get("cumulative_fund_released", 0) or 0)
    progress = float(work.get("physical_progress_percent", 0) or 0)

    # Rule 1: Expenditure exceeds sanctioned amount
    if sanctioned > 0 and expenditure > sanctioned:
        alerts.append({
            "type": "COST_OVERRUN",
            "severity": "HIGH",
            "message": "Expenditure exceeds the sanctioned cost."
        })

    # Rule 2: Very high fund utilization with low physical progress
    if released > 0:
        utilization = (expenditure / released) * 100

        if utilization >= 80 and progress < 40:
            alerts.append({
                "type": "PROGRESS_MISMATCH",
                "severity": "HIGH",
                "message": (
                    f"{utilization:.1f}% of released funds used "
                    f"but physical progress is only {progress:.1f}%."
                )
            })

    # Rule 3: High fund utilization
    if released > 0:
        utilization = (expenditure / released) * 100

        if utilization >= 95:
            alerts.append({
                "type": "HIGH_UTILIZATION",
                "severity": "MEDIUM",
                "message": f"Fund utilization is {utilization:.1f}%."
            })

    return alerts
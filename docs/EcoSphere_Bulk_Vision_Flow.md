
# ♻️ EcoSphere — Bulk Vision Recycling Feature (Full Technical Flow)

This document explains **how to implement the Vision Bulk Recycling Feature** using:

- **Roboflow Inference API** (Object Detection)
- **Climatiq API** (CO₂ calculations)
- **Custom Weight Mapping** (kg per detected material type)
- **TypeScript Backend Flow**
- **Free-tier friendly design**

---

# ✅ 1. High-Level Feature Description

Businesses upload **multiple recycling images** at once.

EcoSphere AI will:

1. Detect each item using Roboflow
2. Estimate weight using a custom mapping table
3. Summarize recycled materials
4. Calculate CO₂ saved using Climatiq
5. Generate optional PDF reports

---

# 📦 8. Entire Bulk Flow (Step-by-Step)

### **User Action**
- Drag/drops 20 images
- Backend processes each via Roboflow
- Aggregates predictions → estimated weight → Climatiq CO₂

---

# ⭐ 9. Recommended File Structure

```
/backend
  /vision
    detect.service.ts
    weight-table.ts
    aggregate.ts
  /carbon
    climatiq.service.ts
  /reports
    report.service.ts
  /routes
    recycle.controller.ts
```

---

# 📥 End of Document

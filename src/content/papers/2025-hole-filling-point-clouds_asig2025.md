---
title: "Hole Filling for 3D Point Clouds via Bézier Curve with C1-Continuity Generation"
authors:
  - Taweechai Nuntawisuttiwong
  - Kittipong Tapyou
  - Wongsatorn Sungsilapawech
venue: "ASIG 2025: Proceedings of the 3rd Asia Symposium on Image and Graphics
"
year: 2025
doi: "https://doi.org/10.1145/3789410.3789411"
tags:
  - Point Cloud
  - Hole Filling
  - Curve Fitting
  - 3D Geometry
---
Point cloud data, widely utilized in diverse applications such as autonomous navigation, heritage preservation, and geospatial modeling, frequently suffers from incompleteness due to occlusions, reflective surfaces, and limited sensor viewpoints. This incompleteness significantly impacts downstream tasks like classification, segmentation, and accurate surface reconstruction. To address this challenge, this paper presents a method for filling missing regions in point cloud data using cubic Bézier curves explicitly $C_1$ constrained by 
 continuity. The proposed technique identifies principal directions of data variance to partition the incomplete point cloud into manageable segments through a 3D slicing approach, facilitating efficient and localized control-point computation and curve fitting. Experimental evaluation demonstrates the high accuracy and geometric fidelity of the reconstructed surfaces, quantified by minimal Euclidean distance errors compared to ground truth data. These results confirm the robustness and effectiveness of the proposed Bézier-based reconstruction approach, providing smooth, structurally coherent, and visually consistent surfaces.
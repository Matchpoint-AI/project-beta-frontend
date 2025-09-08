load("@aspect_rules_js//js:defs.bzl", "js_library")

js_library(
    name = "cost_files",
    srcs = glob(
        [
            "*.tsx",
            "*.ts",
        ],
        allow_empty = True,
    ),
    visibility = ["//frontend/src:__pkg__"],
)

js_library(
    name = "cost_test_files",
    srcs = [
        "CostOptimizationDashboard.test.tsx",
        "CostOptimizationDashboard.tsx",
    ],
    visibility = ["//frontend/src:__pkg__"],
)

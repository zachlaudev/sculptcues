import { onRequestPost as __api_feature_request_js_onRequestPost } from "/agent/repos/sculptcues/functions/api/feature-request.js"
import { onRequestPost as __api_subscribe_js_onRequestPost } from "/agent/repos/sculptcues/functions/api/subscribe.js"

export const routes = [
    {
      routePath: "/api/feature-request",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_feature_request_js_onRequestPost],
    },
  {
      routePath: "/api/subscribe",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_subscribe_js_onRequestPost],
    },
  ]
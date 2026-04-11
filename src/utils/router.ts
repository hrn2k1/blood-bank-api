import { Router } from 'express';
import { CONTROLLER_PREFIX_METADATA_KEY, ROUTE_METADATA_KEY, RouteDefinition } from '../decorators';

/**
 * Register all decorated controllers and routes
 */
export function registerControllers(router: Router, controllers: any[]): void {
  controllers.forEach((ControllerClass) => {
    const controllerInstance = new ControllerClass();
    const prefix = Reflect.getMetadata(CONTROLLER_PREFIX_METADATA_KEY, ControllerClass) || '';
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTE_METADATA_KEY, ControllerClass) || [];

    routes.forEach((route) => {
      const fullPath = `${prefix}${route.path}`;
      const handler = controllerInstance[route.handlerName].bind(controllerInstance);

      switch (route.method) {
        case 'get':
          router.get(fullPath, handler);
          break;
        case 'post':
          router.post(fullPath, handler);
          break;
        case 'put':
          router.put(fullPath, handler);
          break;
        case 'delete':
          router.delete(fullPath, handler);
          break;
        case 'patch':
          router.patch(fullPath, handler);
          break;
      }
    });
  });
}

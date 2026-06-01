import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('login.microsoftonline.com')) {
            return next.handle(req);
        }
        const token = sessionStorage.getItem('token');
        if (token) {
            const clonedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(clonedReq);
        }
        return next.handle(req);
    }
}

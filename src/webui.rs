use actix_web::middleware::Logger;
use actix_web::{server, App, HttpRequest, HttpResponse, Responder, middleware::cors::Cors, fs::StaticFiles};
use data::PlayaData;
use logger::{OkOrLog};

static INDEX_HTML: &'static str = include_str!("../www/index.html");
static MAIN_JS: &'static [u8] = include_bytes!("../www/liveplaya.min.js");

fn builtin_html(_req: HttpRequest) -> impl Responder {
    HttpResponse::Ok()
        .content_type("text/html")
        .body(INDEX_HTML)
}

fn builtin_js(_req: HttpRequest) -> impl Responder {
    HttpResponse::Ok()
        .content_type("application/javascript")
        .body(MAIN_JS)
}

fn features(req: HttpRequest<PlayaData>) -> impl Responder {
    HttpResponse::Ok()
        .content_type("application/json")
        .body(req.state().to_pretty_geojson())
}

fn api_app(data: PlayaData) -> App<PlayaData> {
    App::with_state(data.clone())
        .prefix("/api/v0.2")
        .middleware(Logger::new("%a %r %s"))
        .configure(|app| {
            Cors::for_app(app)
                .resource("/features/", |r| r.f(features))
                .register()
        })
} 

fn ui_app(docroot: &Option<String>) -> App {
    if let Some(dir) = docroot {
        App::new()
            .middleware(Logger::new("%a %r %s"))
            .handler("/", StaticFiles::new(dir.to_string())
                .index_file("index.html"))
            
    } else {
        App::new()
            .middleware(Logger::new("%a %r %s"))
            .resource("/liveplaya.min.js", |r| r.f(builtin_js))
            .resource("/", |r| r.f(builtin_html))
    }    
}

pub fn run(port : u16, data : PlayaData, docroot: Option<String>) {
    server::new(move || {vec![api_app(data.clone()).boxed(), ui_app(&docroot).boxed()]})
        .bind(format!("0.0.0.0:{}", port))
        .unwrap_or_log_and_exit(-1)
    	.workers(2)
        .run();
}

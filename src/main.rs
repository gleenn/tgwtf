#[macro_use] extern crate clap;
#[macro_use] extern crate log;
#[macro_use] extern crate serde_json;
#[macro_use] extern crate failure;

extern crate actix_web;
extern crate ansi_term;
extern crate aprs as aprs_proto;
extern crate atty;
extern crate chrono;
extern crate fap as aprs_parse;
extern crate handlebars;
extern crate serde;
extern crate serial;

mod data;
mod logger;
mod webui;

use clap::{Arg, App, AppSettings};

fn main() {
    const APPNAME : &'static str = "TechnoGecko WTF";
    const HELPHELP : &'static str = "Print help message and exit";

    let args = App::new(APPNAME)
        .setting(AppSettings::ColoredHelp)
        .setting(AppSettings::UnifiedHelpMessage)
        .setting(AppSettings::DeriveDisplayOrder)
        .version(crate_version!())
        .version_message("Print version and exit")
        .help_message(HELPHELP)
        .arg(Arg::with_name("verbose")
             .long("verbose")
             .short("v")
             .global(true)
             .help("Enable verbose log output"))
        .arg(Arg::with_name("nocolor")
             .long("nocolor")
             .global(true)
             .help("Disable colors in log output"))
        .arg(Arg::with_name("timestamp")
             .long("timestamp")
             .global(true)
             .help("Enable timestamps in log output"))
        .arg(Arg::with_name("log")
             .long("log")
             .takes_value(true)
             .help("APRS log file with all received packets"))
        // .arg(Arg::with_name("digest")
        //      .long("digest")
        //      .takes_value(true)
        //      .help("APRS log file with a filtered set of packets relevant to the current state"))
        .arg(Arg::with_name("aprsis")
             .long("aprsis")
             .takes_value(true)
             .help("APRS IS server URL & port"))
        .arg(Arg::with_name("tty")
             .long("tty")
             .takes_value(true)
             .help("Read from given serial device"))
        .arg(Arg::with_name("baudrate")
             .long("baudrate")
             .takes_value(true)
             .help("Baud rate"))
        .arg(Arg::with_name("httpport")
             .long("httpport")
             .takes_value(true)
             .help("Listen the a given port"))
        .arg(Arg::with_name("docroot")
             .long("docroot")
             .takes_value(true)
             .help("Serve files from given directory"))
        .get_matches();

    logger::init(args.occurrences_of("verbose") > 0, 
      args.occurrences_of("nocolor") > 0, 
      args.occurrences_of("timestamp") > 0);

    let http_port = value_t!(args.value_of("httpport"), u16).unwrap_or(8080);
    let log_file = args.value_of("log").unwrap_or("/opt/tgwtf/aprs-beacons.log");
    let digest_file = args.value_of("digest").unwrap_or("/opt/tgwtf/aprs-digest.log");
    let tty = args.value_of("tty").unwrap_or("/dev/ttyUSB0");
    let baudrate = value_t!(args.value_of("baudrate"), u32).unwrap_or(9600);
    let _aprsis_server = args.value_of("aprsis").unwrap_or("rotate.aprs2.net:14580");
    let docroot = args.value_of("docroot");

    info!("{} v{}", APPNAME, crate_version!());

    let mut data = data::PlayaData::new(log_file.to_string(), digest_file.to_string());
    // data.add_aprs_source(data::stores::aprs_is::keep_reading(aprsis_server));
    data.add_aprs_source(data::stores::aprs_serial::keep_reading(tty, baudrate));

    webui::run(http_port, data, docroot.map(|s| s.to_string())); 
}
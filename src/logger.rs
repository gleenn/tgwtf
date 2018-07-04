use ansi_term::Colour::{Red,Cyan,Yellow};
use ansi_term;
use atty;
use std::result::Result;
use std::fmt::{Debug, Display};
use log::{self,Level,Log,Metadata,Record,LevelFilter};
use std::process::exit;

pub use log::Level as LogLevel;

struct Logger {
    level: Level,
    timestamps: bool,
    nocolor: bool,
}

impl Log for Logger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= self.level
    }

    fn log(&self, record: &Record) {
       if self.enabled(record.metadata()) {
            let level = format!("{:<5}", record.level());
            let msg = format!("{}", record.args());
            let ts = if self.timestamps {
                format!("{:?}", ::std::time::SystemTime::now())
                //time::strftime("%Y-%m-%d %H:%M:%S ", &time::now()).unwrap()
            } else {
                String::from("")
            };

            if self.nocolor {
                eprintln!("{}{:<5} {}", ts, level, msg);
            }
            else {
                let style = match record.level() {
                    Level::Debug => Cyan.into(),
                    Level::Warn => Yellow.into(),
                    Level::Error => Red.into(),
                    _ => ansi_term::Style::default(),
                };
                let msg = style.paint(msg);
                let level = style.bold().paint(level);
                eprintln!("{}{:<5} {}", ts, level, msg);
            }
       }
    }

    fn flush(&self) {
        // stderr shouldn't be buffered 
    }
}

fn ucfirst(s: &str) -> String {
    let mut c = s.chars();
    match c.next() {
        None => String::new(),
        Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
    }
}

pub trait OkOrLog {
    type T;

    fn ok_or_log(self) -> Option<Self::T>;
    fn ok_or_log_as(self, level: Level) -> Option<Self::T>;

    fn unwrap_or_log_and_exit(self, code: i32) -> Self::T;
    fn unwrap_or_log_as_and_exit(self, level: Level, code: i32) -> Self::T;

} 

impl<T,E: Debug + Display> OkOrLog for Result<T,E> {
    type T = T;

    fn ok_or_log(self) -> Option<Self::T> {
        self.ok_or_log_as(Level::Warn)
    }

    fn ok_or_log_as(self, level: Level) -> Option<Self::T> {
        match self {
            Ok(v) => Some(v),
            Err(err) => {
                log!(level, "{}", ucfirst(&err.to_string()));
                None
            }
        }
    }

    fn unwrap_or_log_and_exit(self, code: i32) -> Self::T {
        self.unwrap_or_log_as_and_exit(Level::Error, code)
    }

    fn unwrap_or_log_as_and_exit(self, level: Level, code: i32) -> Self::T {
        match self.ok_or_log_as(level) {
            Some(v) => v,
            None => exit(code),
        }
    }

}

pub fn init(verbose : bool, nocolor: bool, timestamps: bool) {
    let level = if verbose { 
        Level::Debug
    } else {
        Level::Info
    };

    #[cfg(windows)]
    let nocolor = nocolor || !enable_ansi_support(); 
    let nocolor = nocolor || !atty::is(atty::Stream::Stderr);

    log::set_boxed_logger(Box::new(Logger{level, nocolor, timestamps})).unwrap();
    log::set_max_level(LevelFilter::Trace);
    debug!("Log level set to {}, colors:{}, timestamps:{}", level, !nocolor, timestamps);
}

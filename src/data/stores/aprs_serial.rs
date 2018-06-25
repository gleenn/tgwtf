#![allow(dead_code)]
use data::formats::aprs::RawPacket;
use chrono::{Utc};
use std::io::{BufReader, BufRead, Error as IoError, ErrorKind as IoErrorKind};
use serial::{self, SerialPort, Error as SerialError};
use std::time::Duration;
use logger::OkOrLog;
use std::iter::repeat;
use std::thread;
// use super::retry;

#[derive(Debug, Fail)]
pub enum Error {
    #[fail(display = "{}: {}", why, tty)]
    Open{ tty: String, why: SerialError },

    #[fail(display = "{}: {}", why, tty)]
    Read{ tty: String, why: IoError },
}

fn not_timeout(res: Result<String,IoError>) -> Option<Result<String,IoError>> {
    match res {
        Err(err) => match err.kind() { 
            IoErrorKind::TimedOut => None,
            _ => Some(Err(err)),
        },
        _ => Some(res),
    }
}

pub fn read(tty: &str, baudrate: u32) -> Result<impl Iterator<Item = RawPacket>, Error> {
    let settings = serial::PortSettings {
        baud_rate:    serial::BaudRate::from_speed(baudrate as usize),
        char_size:    serial::Bits8,
        parity:       serial::ParityNone,
        stop_bits:    serial::Stop1,
        flow_control: serial::FlowNone,
    };
    let mut serport = serial::open(tty).map_err(|e| Error::Open{tty: tty.to_string(), why: e})?;
    serport.configure(&settings).map_err(|e| Error::Open{tty: tty.to_string(), why: e})?;
    serport.set_timeout(Duration::from_secs(1)).map_err(|e| Error::Open{tty: tty.to_string(), why: e})?;

    info!(">>Opened {}, baud rate {:?} ?? {}", tty, settings.baud_rate.speed(), baudrate);

    let tty = tty.to_string();
    let res = BufReader::new(serport)
        .lines()
        .inspect(|l| info!("{:?}", l))
        .filter_map(|l| not_timeout(l))
        .filter_map(move |l| l.ok_or_log())
        .map(move |l| RawPacket{ 
            source: format!("{}", tty),
            data: l.as_bytes().to_vec(), 
            received: Utc::now()})
    ;
    Ok(res)
}

pub fn keep_reading(tty: &str, baudrate: u32) -> impl Iterator<Item = RawPacket> {
    let tty = tty.to_string();
    repeat((tty, baudrate))
        .inspect(|_| thread::sleep(Duration::new(3,0)))
        .map(move |(tty, br)| read(&tty, br))
        .filter_map(|r| r.ok_or_log())
        .flat_map(|i| i)
}

// pub fn keep_reading(tty: &str, baudrate: u32) -> impl Iterator<Item = RawPacket> {
//     let tty = tty.to_string();
//     retry(move || read(&tty, baudrate))
// }
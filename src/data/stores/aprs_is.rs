#![allow(dead_code)]
use data::formats::aprs::RawPacket;
use std::net::TcpStream;
use chrono::{Utc};
use std::io::{BufReader, BufRead, Write, Error as IoError};
use std::iter::repeat;
use std::thread;
use std::time::Duration;
use logger::OkOrLog;

#[derive(Debug, Fail)]
pub enum Error {
    #[fail(display = "failed to connect: {}", err)]
    Connect{ err: IoError },

    #[fail(display = "failed to send data: {}", err)]
    Write{ err: IoError },

    #[fail(display = "failed to receive data: {}", err)]
    Read{ err: IoError },
}

pub fn read(server: &str) -> Result<impl Iterator<Item = RawPacket>, Error> {
    let mut stream = TcpStream::connect(server)
        .map_err(|err| Error::Connect{err})?;

    info!("Connected to {}", server);

    //let hello = b"user N0CALL pass -1 vers brcmap 0.00 filter r/40.79608429483125/-119.19589964220306/200\r\n";
    let hello = b"user N0CALL pass -1 vers brcmap 0.00 filter r/37.371111/-122.0375/100 r/40.79608429483125/-119.19589964220306/100\r\n";

    stream.write(hello)
        .map_err(|err| Error::Write{err})?;

    let server = server.to_string();
    let res = BufReader::new(stream)
        .lines()
        .inspect(|l| debug!("Recv {:?}", l))
        .inspect(|l| if let Err(err) = l { warn!("Received {}", err) })
        .filter_map(|l| l.ok())
        .map(move |l| RawPacket{ 
            source: format!("{}", server),
            data: l.as_bytes().to_vec(), 
            received: Utc::now()})
        // .inspect(|p| info!("Received {:?} {} @ {:?}", p.parsed.symbol(), p.parsed.source(), p.parsed.position()))
    ;
    Ok(res)
}

pub fn keep_reading(server: &str) -> impl Iterator<Item = RawPacket> {
    let server = server.to_string();
    repeat(server)
        .inspect(|_| thread::sleep(Duration::new(3,0)))
        .map(move |server| read(&server))
        .filter_map(|r| r.ok_or_log())
        .flat_map(|i| i)
}

use aprs_parse::{Packet as ParsedPacket, Error as AprsParseError};
use aprs_proto::{Packet as PacketTrait};
use data::model::{Feature};
use std::fmt::{Display, Formatter, Result as FmtResult};
use chrono::{DateTime, Utc};

#[derive(Debug, Fail)]
pub enum Error {
    #[fail(display = "{} is not an APRS packet", raw_packet)]
    NotAprsPacket{ raw_packet: RawPacket },

    #[fail(display = "{}: {}", raw_packet, err)]
    Parse{ raw_packet: RawPacket, err: AprsParseError },
}

#[derive(Debug)]
pub struct RawPacket {
	pub source: String,
	pub received: DateTime<Utc>,
	pub data: Vec<u8>,
}

impl RawPacket {
	fn to_string(&self) -> String {
		String::from_utf8_lossy(&self.data).to_string()
	}
}

impl Display for RawPacket {
    fn fmt(&self, f: &mut Formatter) -> FmtResult {
        write!(f, "[{}] from {}", self.to_string(), self.source)
    }
}

pub fn parse(raw_packet: RawPacket) -> Result<Feature, Error> {
	info!("{}", raw_packet);
	if raw_packet.data.len() < 1 || raw_packet.data[0] == '#' as u8 || raw_packet.data[0] == '$' as u8 {
		return Err(Error::NotAprsPacket{raw_packet});
	}

	let res = ParsedPacket::new(raw_packet.data.clone()).map(|parsed_packet| {
		Feature::AprsStation{
			callsign: parsed_packet.source().to_string(), 
			symbol: parsed_packet.symbol(),
			last_seen: raw_packet.received, 
			last_pos: parsed_packet.position(),
			last_packet: Some(raw_packet.to_string()),
		}
	}).map_err(|err| Error::Parse{ raw_packet, err });
	res
}


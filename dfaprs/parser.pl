#!/usr/bin/perl
use Ham::APRS::FAP qw(parseaprs);
my $aprspacket = 'DFISH>APT314,WIDE1-1,WIDE2-1:/235256h3724.62N/12201.17W>000/000/KG6YJN|!"%2\'^|!w4a!';
my %packetdata;
my $retval = parseaprs($aprspacket, \%packetdata);
if ($retval == 1) {
      my $sep = '';
      print "{";
      while (my ($key, $value) = each(%packetdata)) {
          if ($key eq 'srccallsign') {
              print $sep;
              print "\n";
              $sep = ',';
              print "   \"$key\":\"$value\"";            
          } elsif (  
                $key eq 'timestamp' ||
                $key eq 'speed' ||
                $key eq 'course' ||
                $key eq 'latitude' ||
                $key eq 'longitude' ||
                $key eq 'posresolution'
              ) {
              print $sep;
              print "\n";
              $sep = ',';
              print "   \"$key\":$value";            
          }
      }
      print "\n}\n";
} else {
      print "{ \"error\": \"Parsing failed\"}\n";
}